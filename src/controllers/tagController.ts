import { Request, Response } from 'express';
import { getTopTags } from '../services/tagService';
import { generateTagsFromText } from '../utils/textTagConverter';

export const convertTextToTags = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const tags = await generateTagsFromText(text,  (await getTopTags(1000)).map((tag) => tag.name));
        res.json({ tags });
    } catch (error: any) {
        console.error('Error converting text to tags:', error);
        res.status(500).json({ error: error.message });
    }
};
