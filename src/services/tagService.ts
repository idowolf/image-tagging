import axios from 'axios';
import Tag from '../models/Tag';

// Function to generate or retrieve embeddings for a tag
export const generateEmbedding = async (tag: string): Promise<number[]> => {
    // Check if the embedding already exists
    const existingTag = await Tag.findOne({ name: tag });
    if (existingTag && existingTag.embedding && existingTag.embedding.length > 0) {
        return existingTag.embedding;
    }

    // If not, generate a new embedding
    const response = await axios.post('http://localhost:5001/embed', { text: tag });
    const embedding = response.data.embedding;

    // Store the new embedding in the tag document
    if (existingTag) {
        existingTag.embedding = embedding;
        await existingTag.save();
    }

    return [];
};

export const upsertTags = async (tags: string[]) => {
    for (const tag of tags) {
        const now = new Date();
        const tagDoc = await Tag.findOneAndUpdate(
            { name: tag },
            { $setOnInsert: { createdAt: now }, $set: { updatedAt: now }, $inc: { usageCount: 1 } },
            { upsert: true, new: true }
        );

        // Generate or retrieve embedding and add to FAISS index
        const embedding = await generateEmbedding(tag);
    }
};

export const getTopTags = async (limit: number) => {
    return await Tag.find({}, 'name -_id').sort({ usageCount: -1 }).limit(limit);
};
