import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

export default app;
