/**
 * @fileoverview Contains controller functions for handling image uploads and searches.
 */

import { Request, Response } from 'express';
import { findImagesWithTags } from '../services/imageService';
import fs from 'fs';
import { addImageToQueue } from '../services/queueService';

/**
 * Uploads an image to the server.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @file {File} file - The image file to be uploaded.
 */
export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (req.file) {
            const imgBuffer = await fs.promises.readFile(req.file.path);
            await addImageToQueue(imgBuffer, req.file.path);
            res.status(200).json({ message: 'Image upload initiated' });
        } else {
            throw new Error('No file provided');
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Searches for images by tags.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @body {string[]} tags - The tags to search for.
 * @body {number} [pageNumber=1] - The page number for pagination.
 * @body {number} [pageSize=20] - The number of results per page.
 */
export const searchImages = async (req: Request, res: Response) => {
    const { tags, pageNumber, pageSize } = req.body;
    if (!tags) {
        return res.status(400).json({ error: 'Tags parameter is required' });
    }
    const parsedPageSize = parseInt(pageSize as string) || 20;
    const parsedPageNumber = parseInt(pageNumber as string) || 1;
    try {
        const images = await findImagesWithTags(tags?.toString()?.split(',') ?? [], parsedPageNumber, parsedPageSize);
        res.status(200).json(images);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};