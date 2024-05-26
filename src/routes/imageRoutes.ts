import { Router } from 'express';
import { uploadImage, searchImages } from '../controllers/imageController';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.post('/upload', upload.single('file'), uploadImage);
router.post('/search', searchImages);

export default router;
