import fs from 'fs';
import faiss, { IndexFlatL2 } from 'faiss-node';
import Image from '../models/Image';
import FaissIndex from '../models/FaissIndex';
import mongoose from 'mongoose';
import { extractFeatures } from '../utils/featureExtraction';
import generateTags from '../utils/tagGenerator';

export const addImage = async (imgBuffer: Buffer, filename: string) => {
    const features = await extractFeatures(imgBuffer);
    const imageBase64 = Buffer.from(imgBuffer).toString('base64');
    const tags = await generateTags(imageBase64);

    const newImage = new Image({
        url: `http://localhost:5000/uploads/${filename}`,
        tags,
        metadata: { key: filename },
    });

    const image = await newImage.save();
    await addToFaiss(features, image._id.toString());

    return image;
};

const addToFaiss = async (features: number[], imageId: string) => {
    const dimension = features.length;
    let index: IndexFlatL2;

    if (fs.existsSync('index.faiss')) {
        index = faiss.IndexFlatL2.read('index.faiss');
    } else {
        index = new faiss.IndexFlatL2(dimension);
    }

    index.add(features);
    await FaissIndex.create({ faissIndex: index.ntotal() - 1, imageId });
    index.write('index.faiss');
};

export const findImagesWithTags = async (tags: string[], lastId: string | null, pageSize: number) => {
    const query: any = { tags: { $all: tags } };

    if (lastId) {
        query._id = { $gt: new mongoose.Types.ObjectId(lastId) };
    }

    return await Image.find(query).select('url').sort({ _id: 1 }).limit(pageSize);
};

export const findSimilarImages = async (features: number[]) => {
    let index: IndexFlatL2;

    if (fs.existsSync('index.faiss')) {
        index = faiss.IndexFlatL2.read('index.faiss');
    } else {
        index = new faiss.IndexFlatL2(1024);
    }

    const faissResults = index.search(features, Math.min(index.ntotal(), 10));
    return await FaissIndex.find({ faissIndex: { $in: faissResults.labels } }).populate('imageId');
};
