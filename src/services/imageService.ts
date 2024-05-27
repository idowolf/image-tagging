/**
 * @fileoverview Contains services for handling image-related operations.
 */

import fs from 'fs';
import faiss, { IndexFlatL2 } from 'faiss-node';
import Image from '../models/Image';
import FaissIndex from '../models/FaissIndex';
import generateTags from '../utils/tagGenerator';
import { generateEmbedding, upsertTags } from './tagService';

/**
 * Adds an image to the database and FAISS index.
 * @param {Buffer} imgBuffer - The image buffer.
 * @param {string} filename - The filename of the image.
 * @returns {Promise<IImage>} The saved image document.
 */
export const addImage = async (imgBuffer: Buffer, filename: string) => {
    const imageBase64 = Buffer.from(imgBuffer).toString('base64');
    const tags = await generateTags(imageBase64);
    await upsertTags(tags);
    const tagEmbeddings = await Promise.all(tags.map(tag => generateEmbedding(tag)));
    const combinedEmbedding = tagEmbeddings.reduce((acc, embedding) => {
        for (let i = 0; i < embedding.length; i++) {
            acc[i] = (acc[i] || 0) + embedding[i];
        }
        return acc;
    }, new Array(tagEmbeddings[0].length).fill(0)).map(x => x / tags.length);
    const newImage = new Image({
        url: `http://localhost:5000/uploads/${filename}`,
        metadata: { key: filename },
    });
    const image = await newImage.save();
    await addToFaiss(combinedEmbedding, image._id.toString());
    return image;
};

/**
 * Adds an embedding to the FAISS index.
 * @param {number[]} embedding - The embedding vector.
 * @param {string} imageId - The ID of the image.
 */
const addToFaiss = async (embedding: number[], imageId: string) => {
    const dimension = embedding.length;
    let index: IndexFlatL2;

    if (fs.existsSync('index.faiss')) {
        index = faiss.IndexFlatL2.read('index.faiss');
    } else {
        index = new faiss.IndexFlatL2(dimension);
    }

    index.add(embedding);
    await FaissIndex.create({ faissIndex: index.ntotal() - 1, imageId });
    index.write('index.faiss');
};

/**
 * Finds images with the specified tags.
 * @param {string[]} tags - The tags to search for.
 * @param {number} page - The page number for pagination.
 * @param {number} resultsPerPage - The number of results per page.
 * @returns {Promise<IImage[]>} The found images.
 */
export const findImagesWithTags = async (tags: string[], page: number, resultsPerPage: number) => {
    const embeddings = await Promise.all(tags.map(tag => generateEmbedding(tag)));
    
    let index: faiss.IndexFlatL2;
    if (fs.existsSync('index.faiss')) {
        index = faiss.IndexFlatL2.read('index.faiss');
    } else {
        throw new Error('FAISS index for images not found.');
    }

    const flattenedEmbeddings = embeddings.flat();
    const offset = (page - 1) * resultsPerPage;
    const searchResultsCount = Math.min(index.ntotal(), offset + resultsPerPage);
    const faissResults = index.search(flattenedEmbeddings, searchResultsCount);

    const paginatedLabels = faissResults.labels.slice(offset, offset + resultsPerPage);
    const relevantTags = await FaissIndex.find({ faissIndex: { $in: paginatedLabels } }).populate('imageId');
    const imageIds = relevantTags.map(tag => tag.imageId);

    const images = await Image.find({ _id: { $in: imageIds } }).select('url');

    return images;
};