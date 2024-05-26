import multer from 'multer';

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
export const uploadDisk = multer({ storage: diskStorage });

const memoryStorage = multer.memoryStorage();
export const uploadMemory = multer({ storage: memoryStorage });
