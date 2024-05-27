/**
 * @fileoverview Middleware for handling file uploads using Multer.
 */

import multer from 'multer';

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
export const upload = multer({ storage: diskStorage });