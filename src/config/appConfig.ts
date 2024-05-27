/**
 * @fileoverview Configures the Express application, including middleware and environment variables.
 */

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import dotenv from 'dotenv';

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const SESSION_SECRET = process.env.SESSION_SECRET as string;

export default app;
