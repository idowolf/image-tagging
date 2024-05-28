/**
 * @fileoverview Contains services for handling image-related operations.
 */

import crypto from 'crypto';
import redis from '../config/redisConfig';
import Image from '../models/Image';
import { generateTags } from './llmService';
import { generateEmbedding, upsertTags } from './tagService';
import { addToFaiss, searchFaissIndex } from './vectorService';

const generateImageHash = (imageBase64: string): string => {
    return crypto.createHash('sha256').update(imageBase64).digest('hex');
};


/**
 * Converts the image buffer to a base64 string.
 * @param imgBuffer - The image buffer.
 * @returns The base64 encoded string.
 */
const convertBufferToBase64 = (imgBuffer: Buffer): string => {
    return Buffer.from(imgBuffer).toString('base64');
};

/**
 * Checks if an image with the given hash already exists in the database.
 * @param imageHash - The hash of the image.
 * @returns The existing image if found, otherwise null.
 */
const findExistingImage = async (imageHash: string) => {
    return await Image.findOne({ hash: imageHash });
};

/**
 * Calculates the combined embedding for the given tags.
 * @param tags - The tags to generate embeddings for.
 * @returns The combined embedding array.
 */
const calculateCombinedEmbedding = async (tags: string[]): Promise<number[]> => {
    const tagEmbeddings = await Promise.all(tags.map(tag => generateEmbedding(tag)));
    return tagEmbeddings.reduce((acc, embedding) => {
        for (let i = 0; i < embedding.length; i++) {
            acc[i] = (acc[i] || 0) + embedding[i];
        }
        return acc;
    }, new Array(tagEmbeddings[0].length).fill(0)).map(x => x / tags.length);
};

/**
 * Saves a new image to the database.
 * @param filename - The name of the file.
 * @param imageHash - The hash of the image.
 * @returns The saved image.
 */
const saveNewImage = async (filename: string, imageHash: string) => {
    const newImage = new Image({
        key: filename,
        hash: imageHash,
        metadata: { key: filename },
    });
    return await newImage.save();
};

/**
 * Invalidates the search cache in Redis.
 */
const invalidateSearchCache = async () => {
    const keys = await redis.keys('search:*');
    if (keys.length) {
        await redis.del(keys);
    }
};

/**
 * Adds a new image by processing and saving it.
 * @param imgBuffer - The image buffer.
 * @param filename - The name of the file.
 * @returns The saved image or existing image if duplicate.
 */
export const addImage = async (imgBuffer: Buffer, filename: string) => {
    try {
        console.log("1")
        const imageBase64 = convertBufferToBase64(imgBuffer);
        console.log("2")
        const imageHash = generateImageHash(imageBase64);
        console.log("3")
        const existingImage = await findExistingImage(imageHash);
        console.log("4")
        if (existingImage) {
            console.log('Duplicate image detected, skipping save.');
            return existingImage;
        }
        console.log("5")
        const tags = await generateTags(imageBase64);
        console.log("6")
        await upsertTags(tags);
        console.log("7")
        const combinedEmbedding = await calculateCombinedEmbedding(tags);
        console.log("8")
        const image = await saveNewImage(filename, imageHash);
        console.log("9")
        await addToFaiss(combinedEmbedding, image._id.toString());
        console.log("10")
        await invalidateSearchCache();
        console.log("11")
        return image;
    } catch (error) {
        console.error('Error adding image:', error);
        throw error;
    }
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