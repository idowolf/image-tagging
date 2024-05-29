/**
 * @fileoverview Contains controller functions for handling tag generation and autocomplete.
 */

import { Request, Response } from 'express';
import { autocomplete, generateTagsFromText, getTopTags } from '../services/tagService';

/**
 * Converts text to tags.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @body {string} text - The text to convert to tags.
 * @body {number} topTagsCount - The number of top tags to search from.
 */
export const convertTextToTags = async (req: Request, res: Response) => {
    const { text, topTagsCount } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text parameter is required' });
    }
    const count = topTagsCount || 1000;
    try {
        const tags = await generateTagsFromText(text, count);
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

/**
 * Finds the top tags.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export const findTopTags = async (req: Request, res: Response) => {
    try {
        let limit = 10;
        if (req.query.limit) {
            limit = parseInt(req.query.limit as string);
        }
        const tags = await getTopTags(limit);
        res.status(200).json(tags);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}