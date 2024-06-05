/**
 * @fileoverview Contains services for handling FAISS Index and its related MongoDB model.
 */

import faiss, { IndexFlatL2 } from 'faiss-node';
import Image from '../models/Image';
import fs from 'fs';

let index: IndexFlatL2;
if (fs.existsSync('index.faiss')) {
    index = faiss.IndexFlatL2.read('index.faiss');
} else {
    index = new faiss.IndexFlatL2(384);
}

/**
 * Adds an embedding to the FAISS index.
 * @param {number[]} embedding - The embedding vector.
 */
export const addToFaiss = async (embedding: number[]) => {
    index.add(embedding);
    index.write('index.faiss');
    return index.ntotal() - 1;
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
    try {
        if (index.ntotal() === 0) {
            return [];
        }
        const flattenedEmbeddings = embeddings.flat();
        const offset = (page - 1) * resultsPerPage;
        const searchResultsCount = Math.min(index.ntotal(), offset + resultsPerPage);
        const faissResults = index.search(flattenedEmbeddings, searchResultsCount);
        // Filter the labels whose distance is smaller than 0.3, unless there aren't any, in which case coerce at least the smallest distance + 0.2
        const minDistance = Math.min(...faissResults.distances);
        const threshold = Math.max(minDistance + 0.15, 0.25);
        const filteredLabels = faissResults.labels.filter((_, i) => faissResults.distances[i] < threshold);
        const paginatedLabels = filteredLabels.slice(offset, offset + resultsPerPage);
        const results = await Image.find({ faissIndex: { $in: paginatedLabels } });
        return results.map(result => result._id);
    } catch (error) {
        console.error('Error searching FAISS index:', error);
        throw error;
    }
}