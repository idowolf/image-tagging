import fs from 'fs';
import faiss, { IndexFlatL2 } from 'faiss-node';
import Image from '../models/Image';
import FaissIndex from '../models/FaissIndex';
import generateTags from '../utils/tagGenerator';
import { generateEmbedding, upsertTags } from './tagService';

export const addImage = async (imgBuffer: Buffer, filename: string) => {
    const imageBase64 = Buffer.from(imgBuffer).toString('base64');
    const tags = await generateTags(imageBase64);
    // Upsert tags and generate embeddings
    await upsertTags(tags);
    // Generate or retrieve embeddings for each tag
    const tagEmbeddings = await Promise.all(tags.map(tag => generateEmbedding(tag)));
    // Combine tag embeddings into a single vector (e.g., by averaging)
    const combinedEmbedding = tagEmbeddings.reduce((acc, embedding) => {
        for (let i = 0; i < embedding.length; i++) {
            acc[i] = (acc[i] || 0) + embedding[i];
        }
        return acc;
    }, new Array(tagEmbeddings[0].length).fill(0)).map(x => x / tags.length);
    // Create and save the new image document
    const newImage = new Image({
        url: `http://localhost:5000/uploads/${filename}`,
        tags,
        metadata: { key: filename },
    });
    const image = await newImage.save();

    // Add the combined embedding to the FAISS index
    await addToFaiss(combinedEmbedding, image._id.toString());

    return image;
};

const addToFaiss = async (embedding: number[], imageId: string) => {
    const dimension = embedding.length;
    let index: IndexFlatL2;

    if (fs.existsSync('index.faiss')) {
        index = faiss.IndexFlatL2.read('index.faiss');
    } else {
        index = new faiss.IndexFlatL2(dimension);
    }

    // Add the embedding to the FAISS index
    index.add(embedding);
    await FaissIndex.create({ faissIndex: index.ntotal() - 1, imageId });
    index.write('index.faiss');
};

export const findImagesWithTags = async (tags: string[]) => {
    // Generate embeddings for the provided tags
    const embeddings = await Promise.all(tags.map(tag => generateEmbedding(tag)));
    
    let index: IndexFlatL2;

    if (fs.existsSync('index.faiss')) {
        index = faiss.IndexFlatL2.read('index.faiss');
    } else {
        throw new Error('FAISS index for images not found.');
    }

    // Flatten the embeddings array for search
    const flattenedEmbeddings = embeddings.flat();
    const faissResults = index.search(flattenedEmbeddings, Math.min(index.ntotal(), 10));
    
    const relevantTags = await FaissIndex.find({ faissIndex: { $in: faissResults.labels } }).populate('imageId');

    // Extract image IDs from the relevant tags
    const imageIds = relevantTags.map(tag => tag.imageId);

    // Retrieve the images from MongoDB
    const images = await Image.find({ _id: { $in: imageIds } }).select('url');
    return images;
};

export const findSimilarImages = async (features: number[]) => {
    let index: IndexFlatL2;

    if (fs.existsSync('index.faiss')) {
        index = faiss.IndexFlatL2.read('index.faiss');
    } else {
        index = new faiss.IndexFlatL2(384);
    }

    const faissResults = index.search(features, Math.min(index.ntotal(), 10));
    return await FaissIndex.find({ faissIndex: { $in: faissResults.labels } }).populate('imageId');
};
