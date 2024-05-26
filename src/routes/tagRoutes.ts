import { Router } from 'express';
import { convertTextToTags } from '../controllers/tagController';

const router = Router();

router.post('/convertTextToTags', convertTextToTags);

export default router;
