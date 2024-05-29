/**
 * @fileoverview Defines the routes for tag generation and autocomplete.
 */

import { Router } from 'express';
import { convertTextToTags, autocompleteTags, findTopTags } from '../controllers/tagController';
import { authMiddleware } from '../middlewares/authMiddleware';
import cacheMiddleware from '../middlewares/cacheMiddleware';
import createCacheKeyMiddleware from '../middlewares/createCacheKeyMiddleware';
import saveCacheMiddleware from '../middlewares/saveCacheMiddleware';
import { CACHE_TIMEOUT } from '../config/appConfig';

const router = Router();

/**
 * @route POST /api/tags/convertTextToTags
 * @description Converts text to tags.
 * @header {string} Authorization - Bearer token for authentication.
 * @body {string} text - The text to convert to tags.
 * @body {number} topTagsCount - The number of top tags to search from.
 */
router.post('/convertTextToTags', authMiddleware, createCacheKeyMiddleware, cacheMiddleware, saveCacheMiddleware(CACHE_TIMEOUT), convertTextToTags);

/**
 * @route GET /api/tags/autocomplete
 * @description Provides autocomplete suggestions for tags.
 * @header {string} Authorization - Bearer token for authentication.
 * @query {string} query - The query string to autocomplete.
 */
router.get('/autocomplete', authMiddleware, createCacheKeyMiddleware, cacheMiddleware, saveCacheMiddleware(CACHE_TIMEOUT), autocompleteTags);

/**
 * @route GET /api/tags/top_tags
 * @description Finds the top tags.
 * @header {string} Authorization - Bearer token for authentication.
 * @query {number} limit - The number of top tags to find.
 * @response {string[]} tags - The top tags.
 */
router.get('/top_tags', authMiddleware, createCacheKeyMiddleware, cacheMiddleware, saveCacheMiddleware(CACHE_TIMEOUT), findTopTags);

export default router;
