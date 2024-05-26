import { Router } from 'express';
import { convertTextToTags, autocompleteTags } from '../controllers/tagController';

const router = Router();

router.post('/convertTextToTags', convertTextToTags);
router.get('/autocomplete', autocompleteTags);

export default router;
