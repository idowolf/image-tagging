/**
 * @fileoverview Contains services related to the external NLP Python microservice.
 */

import axios from 'axios';
import { NLP_SERVER_URL } from '../config/appConfig';

/**
 * Embeds the given text using an external service.
 * @param text - The text to be embedded.
 * @returns The embedding of the text.
 */
export const embedText = async (text: string) => {
    const response = await axios.post(`${NLP_SERVER_URL}/embed`, { text });
    const embedding = response.data.embedding;
    return embedding;
}

/**
 * Retrieves relevant tags based on the provided text and top tags.
 * @param text - The input text to analyze.
 * @param topTags - An array of top tags to consider.
 * @returns A Promise that resolves to an array of relevant tags.
 */
export const getRelevantTags = async (text: string, topTags: string[]) => {
    const response = await axios.post(`${NLP_SERVER_URL}/relevant-tags`, { free_text: text, top_tags: topTags });
    const relevantTags = response.data.relevant_tags;
    return relevantTags;
}