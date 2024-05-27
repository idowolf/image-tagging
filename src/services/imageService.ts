/**
 * @fileoverview Contains services for handling image-related operations.
 */

import Image from '../models/Image';
import { generateTags } from './llmService';
import { generateEmbedding, upsertTags } from './tagService';
import { addToFaiss, searchFaissIndex } from './vectorService';

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
        key: `uploads/${filename}`,
        metadata: { key: filename },
    });
    const image = await newImage.save();
    await addToFaiss(combinedEmbedding, image._id.toString());
    return image;
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

    const imageIds = await searchFaissIndex(embeddings, page, resultsPerPage);

    const images = await Image.find({ _id: { $in: imageIds } }).select('key');

    return images;
};