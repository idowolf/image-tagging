/**
 * @fileoverview Contains controller functions for handling tag generation and autocomplete.
 */

import { Request, Response } from 'express';
import { generateTagsFromText, autocomplete } from '../utils/textTagConverter';

/**
 * Converts text to tags.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @body {string} text - The text to convert to tags.
 * @body {number} topTags - The number of top tags to generate.
 */
export const convertTextToTags = async (req: Request, res: Response) => {
    const { text, topTags } = req.body;
    try {
        const tags = await generateTagsFromText(text, topTags);
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
    try {
        const tags = await autocomplete(query as string);
        res.status(200).json(tags);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
