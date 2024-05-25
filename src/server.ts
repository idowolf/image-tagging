import express, { Request, Response } from 'express';
import faiss, { IndexFlatL2, SearchResult } from 'faiss-node';
import axios from 'axios';
import { spawn } from 'child_process';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import multer from 'multer';
import tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import Image from './models/Image';
import mongoose, { Schema } from 'mongoose';
import Tag from './models/Tag';
import FaissIndex from './models/FaissIndex';
import { exec } from 'child_process';

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = 'mongodb://localhost:27017/imageDB';

const connectToDatabase = async () => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err);
    }
};

// Static folder to serve images
app.use('/uploads', express.static('uploads'));

// Configure multer for disk storage
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const uploadDisk = multer({ storage: diskStorage });

// Configure multer for memory storage
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

const loadModel = async (): Promise<tf.GraphModel> => {
    const model = await tf.loadGraphModel('file://src/models/mobilenet/model.json');
    return model;
};

const extractFeatures = async (imgBuffer: Buffer): Promise<number[]> => {
    const model = await loadModel();

    // Load the image
    const image = tf.node.decodeImage(imgBuffer, 3);
    const resizedImage = tf.image.resizeBilinear(image, [224, 224]);
    const normalizedImage = resizedImage.div(255.0).expandDims(0);

    // Extract features
    const features = model.predict(normalizedImage) as tf.Tensor;
    return Array.from(features.dataSync());
};

const addToFaiss = async (features: number[], imageId: string): Promise<void> => {
    const dimension = features.length;
    let index: IndexFlatL2;
    if (fs.existsSync('index.faiss')) {
        index = faiss.IndexFlatL2.read('index.faiss');
    } else {
        index = new faiss.IndexFlatL2(dimension);
    }

    const featureArray = features;
    index.add(featureArray);

    const indexId = index.ntotal() - 1;

    await FaissIndex.create({ faissIndex: indexId, imageId });

    index.write('index.faiss');

    console.log('Features added to FAISS index');
};

connectToDatabase();

async function generateTags(imageBase64: string): Promise<string[]> {
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'llava',
            format: 'json',
            prompt: 'You are an assistive AI tool at a mobile game company, aiding graphic designers in finding graphics by tags. Generate 20 or less tags for the attached image describing its contents, such as describing backgrounds, characters, objects and texts, in generic terms. Examples: \'pig\', \'house\', or \'snow\'. No need for tags that apply to all images in this context, such as \'Game\' or \'App\'. Return 20 or less tags as an array, formatted as {"tags": ["tag1", "tag2", ...]}.',
            stream: false,
            images: [imageBase64]
        });
        const tags = JSON.parse(response.data.response).tags;
        return tags;
    } catch (error) {
        console.error('Error generating tags:', error);
        return [];
    }
}

app.post('/upload', uploadDisk.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imgBuffer = fs.readFileSync(req.file.path);
        const features = await extractFeatures(imgBuffer);

        const imageBase64 = Buffer.from(imgBuffer).toString('base64');

        const tags = (await generateTags(imageBase64)).map((tag: string) => tag.toLowerCase());

        const newImage = new Image({
            url: `http://localhost:5000/uploads/${req.file.filename}`,
            tags,
            metadata: {
                key: req.file.filename,
            }
        });

        const image = await newImage.save();
        await addToFaiss(features, image._id.toString());
        await upsertTags(tags);

        res.json({
            message: 'Image uploaded successfully',
            image,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const upsertTags = async (tags: string[]) => {
    try {
        for (const tag of tags) {
            const now = new Date();
            await Tag.findOneAndUpdate(
                { name: tag },
                { $setOnInsert: { createdAt: now }, $set: { updatedAt: now }, $inc: { usageCount: 1 } },
                { upsert: true, new: true }
            );
        }
    } catch (error) {
        console.error('Error upserting tags:', error);
    }
};

const findImagesWithTags = async (tags: string[], lastId: string | null, pageSize: number) => {
    const query: any = { tags: { $all: tags } };

    if (lastId) {
        query._id = { $gt: new mongoose.Types.ObjectId(lastId) };
    }

    try {
        const images = await Image.find(query)
            .select('url') // Project only necessary fields
            .sort({ _id: 1 }) // Sort by _id to maintain consistent order
            .limit(pageSize);

        return images;
    } catch (error) {
        console.error('Error finding images:', error);
        throw error;
    }
};

// Search by tags
app.get('/search', async (req: Request, res: Response) => {
    const { tags, lastId, pageSize } = req.query;
    if (!tags) {
        return res.status(400).json({ error: 'Tags parameter is required' });
    }
    const results = await findImagesWithTags(tags.toString().split(','), lastId as string | null, parseInt(pageSize as string) || 20);
    res.json(results);
});

// Hybrid search by tags and similarity
// app.get('/searchhybrid', async (req: Request, res: Response) => {
//     const { tags, lastId, pageSize } = req.query;
//     if (!tags) {
//         return res.status(400).json({ error: 'Tags parameter is required' });
//     }

//     const tagList = tags.toString().split(',');
//     const pageSizeInt = parseInt(pageSize as string) || 20;
    
//     try {
//         // Step 1: Search by tags in MongoDB
//         const images = await findImagesWithTags(tagList, lastId as string | null, pageSizeInt);

//         if (images.length === 0) {
//             return res.json([]);
//         }

//         // Step 2: Extract features of the retrieved images
//         const featurePromises = images.map(async (image) => {
//             const imgBuffer = fs.readFileSync(image.url.replace('http://localhost:5000', '.'));
//             const features = await extractFeatures(imgBuffer);
//             return features;
//         });

//         const imageFeatures = await Promise.all(featurePromises);

//         // Step 3: Combine the features to get a single representative feature vector
//         const combinedFeatures = imageFeatures.reduce((acc, features) => {
//             return acc.map((val, index) => val + features[index]);
//         });

//         // Normalize the combined features
//         const combinedFeatureVector = combinedFeatures.map((val) => val / images.length);

//         // Step 4: Use Faiss for similarity search with the combined feature vector
//         let index: IndexFlatL2;
//         if (fs.existsSync('index.faiss')) {
//             index = faiss.IndexFlatL2.read('index.faiss');
//         } else {
//             index = new faiss.IndexFlatL2(1024);
//         }

//         const currentFaissIndex = index.ntotal();
//         const results: SearchResult = index.search(combinedFeatureVector, Math.min(currentFaissIndex, 10));

//         const actualResults = await FaissIndex.find({ faissIndex: { $in: results.labels } }).populate('imageId');

//         res.json(actualResults.map((result) => result.imageId));
//     } catch (error: any) {
//         console.error('Error performing hybrid search:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// Autocomplete endpoint
app.get('/autocomplete', async (req: Request, res: Response) => {
    const { query } = req.query;
    console.log(query);
    const results = await Tag.find({ name: { $regex: query, $options: 'i' } });
    res.json(results.map(result => result.name));
});

// Search by image similarity
app.post('/searchBySimilarity', uploadMemory.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imgBuffer = fs.readFileSync(req.file.path);
    const features = await extractFeatures(imgBuffer);

    let index: IndexFlatL2;
    if (fs.existsSync('index.faiss')) {
        index = faiss.IndexFlatL2.read('index.faiss');
    } else {
        index = new faiss.IndexFlatL2(1024);
    }

    const currentFaissIndex = index.ntotal();

    const faissResults: SearchResult = index.search(features, Math.min(currentFaissIndex, 10));

    const results = await FaissIndex.find({ faissIndex: { $in: faissResults.labels } }).populate('imageId');

    res.json(results.map((result) => result.imageId));
});

app.get('/top-tags', async (req, res) => {
    try {
      const tags = await Tag.find({}, 'name -_id').sort({ usageCount: -1 }).limit(1000);
      res.status(200).send(tags);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });
  

app.listen(5000, () => {
    console.log('Server started on port 5000');
});

async function generateTagsFromText(text: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '/scripts/nlp.py');
        exec(`python ${scriptPath} "${text}"`, (error, stdout, _) => {
            if (error) {
                return reject(error);
            }
            try {
                const tags = JSON.parse(stdout);
                resolve(tags);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}

// Convert free text to tags using Python script
app.post('/convertTextToTags', async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const tags = await generateTagsFromText(text);
        res.json({ tags });
    } catch (error: any) {
        console.error('Error converting text to tags:', error);
        res.status(500).json({ error: error.message });
    }
});