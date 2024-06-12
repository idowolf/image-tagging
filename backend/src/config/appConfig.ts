/**
 * @fileoverview Configures the Express application, including middleware and environment variables.
 */

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import dotenv from 'dotenv';

const app = express();
app.use(bodyParser.json({ limit: '2000mb' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const SESSION_SECRET = process.env.SESSION_SECRET as string;
export const LLM_SERVER_URL = process.env.LLM_SERVER_URL as string;
export const NLP_SERVER_URL = process.env.NLP_SERVER_URL as string;
export const CLIENT_APP_URL = process.env.CLIENT_APP_URL as string;
export const MONGO_DB_URI = process.env.MONGO_DB_URI as string;
export const GOOGLE_OAUTH2_CLIENT_ID = process.env.GOOGLE_OAUTH2_CLIENT_ID as string;
export const GOOGLE_OAUTH2_CLIENT_SECRET = process.env.GOOGLE_OAUTH2_CLIENT_SECRET as string;
export const SERVER_PORT = parseInt(process.env.SERVER_PORT as string);
export const REDIS_HOST = process.env.REDIS_HOST as string;
export const REDIS_PORT = parseInt(process.env.REDIS_PORT as string);
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string;

export const CACHE_TIMEOUT = 60; // 60 second cache just for simulation purposes

export default app;
