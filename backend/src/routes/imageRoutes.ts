/**
 * @fileoverview Defines the routes for image uploads and searches.
 */

import { Router } from 'express';
import { uploadImage, searchImages } from '../controllers/imageController';
import { upload } from '../middlewares/uploadMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import cacheMiddleware from '../middlewares/cacheMiddleware';
import saveCacheMiddleware from '../middlewares/saveCacheMiddleware';
import createCacheKeyMiddleware from '../middlewares/createCacheKeyMiddleware';
import { CACHE_TIMEOUT } from '../config/appConfig';

const router = Router();

/**
 * @route POST /api/images/upload
 * @description Uploads an image to the server.
 * @header {string} Authorization - Bearer token for authentication.
 * @file {File} file - The image file to be uploaded.
 */
router.post('/upload', authMiddleware, upload.single('file'), uploadImage);

/**
 * @route POST /api/images/search
 * @description Searches for images by tags.
 * @header {string} Authorization - Bearer token for authentication.
 * @body {string[]} tags - The tags to search for.
 * @body {number} [pageNumber=1] - The page number for pagination.
 * @body {number} [pageSize=20] - The number of results per page.
 */
router.post('/search', authMiddleware, searchImages);

export default router;