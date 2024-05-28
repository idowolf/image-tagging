import { Queue, Worker } from 'bullmq';
import redis from '../config/redisConfig';
import { addImage } from './imageService';

const imageQueue = new Queue('image-processing', { connection: redis  });

/**
 * Represents a worker that processes image jobs.
 */
const worker = new Worker('image-processing', async job => {
    const { imgBuffer, filename } = job.data;
    await addImage(imgBuffer, filename);
}, { connection: redis });

/**
 * @fileoverview This file contains the queue service for image tagging backend.
 * It handles the processing of image jobs using a worker.
 */

worker.on('failed', (job, err) => {
    if (!job) {
        return console.error('Job failed with error:', err.message);
    }
    console.error(`Job with ID ${job.id} has failed with error: ${err.message}`);
});

export const addImageToQueue = async (imgBuffer: Buffer, filename: string) => {
    await imageQueue.add('process-image', { imgBuffer, filename });
};
