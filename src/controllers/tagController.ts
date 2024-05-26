import { Request, Response } from 'express';
import { getTopTags, upsertTags } from '../services/tagService';
import { generateTagsFromText } from '../utils/textTagConverter';

export const getTopTagsHandler = async (req: Request, res: Response) => {
    try {
        const tags = await getTopTags(1000);
        res.status(200).send(tags);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
};

export const convertTextToTags = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const tags = await generateTagsFromText(text);
        res.json({ tags });
    } catch (error: any) {
        console.error('Error converting text to tags:', error);
        res.status(500).json({ error: error.message });
    }
};
