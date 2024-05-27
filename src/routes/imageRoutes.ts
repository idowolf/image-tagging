import { Router } from 'express';
import { uploadImage, searchImages } from '../controllers/imageController';
import { upload } from '../middlewares/uploadMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/upload', authMiddleware, upload.single('file'), uploadImage);
router.post('/search', authMiddleware, searchImages);

export default router;