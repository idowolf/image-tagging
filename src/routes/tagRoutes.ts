import { Router } from 'express';
import { convertTextToTags } from '../controllers/tagController';
import Tag from '../models/Tag';

const router = Router();

router.post('/convertTextToTags', convertTextToTags);
// Test endpoint that creates a new tag called "Hello world"
router.post('/hello', async (req, res) => {
    Tag.create({ name: 'Hello world this is ido 2' });
    res.status(200).json({ message: 'Hello world' });
});
// Simulate curl for hello
// curl -X POST http://localhost:3000/api/tag/hello
export default router;
