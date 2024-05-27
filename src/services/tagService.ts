/**
 * @fileoverview Contains services for handling tag-related operations.
 */

import Tag from '../models/Tag';
import { embedText, getRelevantTags } from './nlpService';

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

    const embedding = await embedText(tag);

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
        await Tag.findOneAndUpdate(
            { name: tag },
            { $setOnInsert: { createdAt: now }, $set: { updatedAt: now }, $inc: { usageCount: 1 } },
            { upsert: true, new: true }
        );

        await generateEmbedding(tag);
    }
};

/**
 * Generates tags from text.
 * @param {string} text - The text to convert to tags.
 * @param {string[]} topTags - The top tags to consider.
 * @returns {Promise<string[]>} The generated tags.
 */
export const generateTagsFromText = async (text: string): Promise<string[]> => {
    try {
        const response = await getRelevantTags(text, await getTopTags(1000));
        return response;
    } catch (error) {
        console.error('Error generating tags:', error);
        throw error;
    }
};

/**
 * Provides autocomplete suggestions for tags.
 * @param {string} query - The query string to autocomplete.
 * @returns {Promise<string[]>} The autocomplete suggestions.
 */
export const autocomplete = async (query: string): Promise<string[]> => {
    try {
        const tags = await Tag.find({ name: { $regex: new RegExp(`^${query}`, 'i') } }).limit(10);
        return tags.map(tag => tag.name);
    } catch (error) {
        console.error('Error autocompleting tags:', error);
        throw error;
    }
};

/**
 * Retrieves the top tags by usage count.
 * @param {number} limit - The maximum number of tags to retrieve.
 * @returns {Promise<string[]>} The top tags.
 */
export const getTopTags = async (limit: number): Promise<string[]> => {
    return await (await Tag.find({}, 'name -_id').sort({ usageCount: -1 }).limit(limit)).map(tag => tag.name);
};
