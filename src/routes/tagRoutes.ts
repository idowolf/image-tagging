import { Router } from 'express';
import { convertTextToTags, autocompleteTags } from '../controllers/tagController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/convertTextToTags', authMiddleware, convertTextToTags);
router.get('/autocomplete', authMiddleware, autocompleteTags);

export default router;
