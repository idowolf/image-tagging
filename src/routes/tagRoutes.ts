/**
 * @fileoverview Defines the routes for tag generation and autocomplete.
 */

import { Router } from 'express';
import { convertTextToTags, autocompleteTags } from '../controllers/tagController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route POST /api/tags/convertTextToTags
 * @description Converts text to tags.
 * @header {string} Authorization - Bearer token for authentication.
 * @body {string} text - The text to convert to tags.
 * @body {number} topTags - The number of top tags to generate.
 */
router.post('/convertTextToTags', authMiddleware, convertTextToTags);

/**
 * @route GET /api/tags/autocomplete
 * @description Provides autocomplete suggestions for tags.
 * @header {string} Authorization - Bearer token for authentication.
 * @query {string} query - The query string to autocomplete.
 */
router.get('/autocomplete', authMiddleware, autocompleteTags);

export default router;
