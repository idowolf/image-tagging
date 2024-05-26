import { Request, Response } from 'express';
import { generateTagsFromText, autocomplete } from '../utils/textTagConverter';

export const convertTextToTags = async (req: Request, res: Response) => {
    const { text, topTags } = req.body;
    try {
        const tags = await generateTagsFromText(text, topTags);
        res.status(200).json(tags);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const autocompleteTags = async (req: Request, res: Response) => {
    const { query } = req.query;
    try {
        const tags = await autocomplete(query as string);
        res.status(200).json(tags);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
