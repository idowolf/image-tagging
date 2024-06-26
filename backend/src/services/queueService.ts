/**
 * @fileoverview This file contains the queue service for image tagging backend.
 * It handles the processing of image jobs using a worker.
 */

import { Queue, Worker } from 'bullmq';
import redis from '../config/redisConfig';
import { addImage } from './imageService';

const imageQueue = new Queue('image-processing', { connection: redis  });

const worker = new Worker('image-processing', async job => {
    const { imgBuffer, filename } = job.data;
    console.log(`Processing image: ${filename}`);
    await addImage(imgBuffer, filename);
}, { connection: redis });

worker.on('failed', (job, err) => {
    if (!job) {
        return console.error('Job failed with error:', err.message);
    }
    console.error(`Job with ID ${job.id} has failed with error: ${err.message}`);
});

export const addImageToQueue = async (imgBuffer: Buffer, filename: string) => {
    console.log(`Adding image to queue: ${filename}`);
    await imageQueue.add('process-image', { imgBuffer, filename });
};
