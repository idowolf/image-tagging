import { Request, Response, NextFunction } from 'express';
import redis from '../config/redisConfig';

/**
 * Middleware function that saves the response body to cache using Redis.
 * @param cacheDuration The duration (in seconds) for which the cache should be stored.
 * @returns The middleware function.
 */
const saveCacheMiddleware = (cacheDuration: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const originalSend = res.send.bind(res);

        res.send = (body: any) => {
            const cacheKey = res.locals.cacheKey;
            if (cacheKey) {
                redis.set(cacheKey, body, 'EX', cacheDuration)
                    .then(() => {
                    })
                    .catch((err) => {
                        console.error('Error saving cache:', err);
                    });
            }

            return originalSend(body);
        };

        next();
    };
};

export default saveCacheMiddleware;
