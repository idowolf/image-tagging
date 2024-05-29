import { Request, Response, NextFunction } from 'express';
import redis from '../config/redisConfig';

/**
 * Middleware function for caching data.
 * 
 * @param _req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
const cacheMiddleware = async (_req: Request, res: Response, next: NextFunction) => {
    const cacheKey = res.locals.cacheKey;
    if (!cacheKey) {
        return next();
    }
    try {
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        } else {
            next();
        }
    } catch (error) {
        console.error('Redis error:', error);
        next();
    }
};

export default cacheMiddleware;
