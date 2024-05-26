import { Request, Response } from 'express';
import fs from 'fs';
import { addImage, findImagesWithTags, findSimilarImages } from '../services/imageService';
import { upsertTags } from '../services/tagService';
import { extractFeatures } from '../utils/featureExtraction';

export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imgBuffer = fs.readFileSync(req.file.path);
        const image = await addImage(imgBuffer, req.file.filename);
        await upsertTags(image.tags);

        res.json({ message: 'Image uploaded successfully', image });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const searchImages = async (req: Request, res: Response) => {
    const { tags, lastId, pageSize } = req.query;
    if (!tags) {
        return res.status(400).json({ error: 'Tags parameter is required' });
    }
    const results = await findImagesWithTags(tags.toString().split(','), lastId as string | null, parseInt(pageSize as string) || 20);
    res.json(results);
};

export const searchBySimilarity = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imgBuffer = fs.readFileSync(req.file.path);
    const features = await extractFeatures(imgBuffer);
    const results = await findSimilarImages(features);
    res.json(results.map((result) => result.imageId));
};
