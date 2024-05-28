/**
 * @fileoverview Contains controller functions for handling tag generation and autocomplete.
 */

import { Request, Response } from 'express';
import { autocomplete, generateTagsFromText } from '../services/tagService';

/**
 * Converts text to tags.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @body {string} text - The text to convert to tags.
 */
export const convertTextToTags = async (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text parameter is required' });
    }
    try {
        const tags = await generateTagsFromText(text);
        res.status(200).json(tags);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Provides autocomplete suggestions for tags.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @query {string} query - The query string to autocomplete.
 */
export const autocompleteTags = async (req: Request, res: Response) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    try {
        const tags = await autocomplete(query as string);
        res.status(200).json(tags);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}