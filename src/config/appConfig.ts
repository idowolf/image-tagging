import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

export default app;
