/**
 * @fileoverview Middleware for handling file uploads using Multer.
 */

import multer from 'multer';
import fs from 'fs';

const diskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const path = `./uploads/`
        fs.mkdirSync(path, { recursive: true })
        return cb(null, path)  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
export const upload = multer({ storage: diskStorage });