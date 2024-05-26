import { Request, Response } from 'express';
import { addImage, findImagesWithTags, findSimilarImages } from '../services/imageService';
import fs from 'fs';

export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (req.file) {
            const imgBuffer = await fs.promises.readFile(req.file.path);
            const image = await addImage(imgBuffer, req.file.originalname);
            res.status(201).json(image);
        } else {
            throw new Error('No file provided');
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const searchImages = async (req: Request, res: Response) => {
    const { tags, lastId, pageSize } = req.query;
    if (!tags) {
        return res.status(400).json({ error: 'Tags parameter is required' });
    }
    // Try to parse the page size as an integer and default to 10 if it fails
    const parsedPageSize = parseInt(pageSize as string, 10);
    const finalPageSize = isNaN(parsedPageSize) ? 10 : parsedPageSize;
    try {
        const images = await findImagesWithTags(tags?.toString()?.split(',') ?? [], lastId?.toString(), finalPageSize);
        res.status(200).json(images);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};