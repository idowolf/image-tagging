import { Router } from 'express';
import { getTopTagsHandler, convertTextToTags } from '../controllers/tagController';

const router = Router();

router.get('/top-tags', getTopTagsHandler);
router.post('/convertTextToTags', convertTextToTags);

export default router;
