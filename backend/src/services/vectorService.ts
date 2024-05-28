/**
 * @fileoverview Contains services for handling FAISS Index and its related MongoDB model.
 */

import faiss, { IndexFlatL2 } from 'faiss-node';
import FaissIndex from '../models/FaissIndex';
import fs from 'fs';

/**
 * Adds an embedding to the FAISS index.
 * @param {number[]} embedding - The embedding vector.
 * @param {string} imageId - The ID of the image.
 */
export const addToFaiss = async (embedding: number[], imageId: string) => {
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
 * Searches the FAISS index for similar images based on the given embeddings.
 * @param embeddings - The embeddings of the images to search for.
 * @param page - The page number of the search results.
 * @param resultsPerPage - The number of results to display per page.
 * @returns An array of image IDs representing the similar images found in the index.
 * @throws An error if the FAISS index file is not found.
 */
export const searchFaissIndex = async (embeddings: number[][], page: number, resultsPerPage: number) => {
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
    return imageIds;
}