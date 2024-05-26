import { Request, Response } from 'express';
import { addImage, findImagesWithTags } from '../services/imageService';
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
    const { tags, pageNumber, pageSize } = req.body;
    if (!tags) {
        return res.status(400).json({ error: 'Tags parameter is required' });
    }
    // Try to parse the page number and page size, fallback to undefined if not a number
    const parsedPageSize = parseInt(pageSize as string) || 3;
    const parsedPageNumber = parseInt(pageNumber as string) || 1;
    try {
        const images = await findImagesWithTags(tags?.toString()?.split(',') ?? [], parsedPageNumber, parsedPageSize);
        res.status(200).json(images);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};