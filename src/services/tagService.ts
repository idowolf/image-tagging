/**
 * @fileoverview Contains services for handling tag-related operations.
 */

import axios from 'axios';
import Tag from '../models/Tag';

/**
 * Generates or retrieves an embedding for a tag.
 * @param {string} tag - The tag to generate an embedding for.
 * @returns {Promise<number[]>} The embedding vector.
 */
export const generateEmbedding = async (tag: string): Promise<number[]> => {
    const existingTag = await Tag.findOne({ name: tag });
    if (existingTag && existingTag.embedding && existingTag.embedding.length > 0) {
        return existingTag.embedding;
    }

    const response = await axios.post('http://localhost:5001/embed', { text: tag });
    const embedding = response.data.embedding;

    if (existingTag) {
        existingTag.embedding = embedding;
        await existingTag.save();
    }

    return [];
};

/**
 * Upserts tags in the database.
 * @param {string[]} tags - The tags to upsert.
 */
export const upsertTags = async (tags: string[]) => {
    for (const tag of tags) {
        const now = new Date();
        const tagDoc = await Tag.findOneAndUpdate(
            { name: tag },
            { $setOnInsert: { createdAt: now }, $set: { updatedAt: now }, $inc: { usageCount: 1 } },
            { upsert: true, new: true }
        );

        const embedding = await generateEmbedding(tag);
    }
};

/**
 * Retrieves the top tags by usage count.
 * @param {number} limit - The maximum number of tags to retrieve.
 * @returns {Promise<string[]>} The top tags.
 */
export const getTopTags = async (limit: number) => {
    return await Tag.find({}, 'name -_id').sort({ usageCount: -1 }).limit(limit);
};
