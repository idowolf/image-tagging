import { Router } from 'express';
import { uploadImage, searchImages, searchBySimilarity } from '../controllers/imageController';
import { uploadDisk, uploadMemory } from '../middlewares/uploadMiddleware';

const router = Router();

router.post('/upload', uploadDisk.single('file'), uploadImage);
router.get('/search', searchImages);
router.post('/searchBySimilarity', uploadMemory.single('file'), searchBySimilarity);

export default router;
