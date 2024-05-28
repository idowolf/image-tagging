import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function to create a cache key based on the request path and parameters.
 * The cache key is stored in the `res.locals.cacheKey` property.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
const createCacheKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const base = req.baseUrl || res.locals.route;
    let cacheKey: string | null = null;

    switch (req.path) {
        case '/search':
            const { tags, pageNumber, pageSize } = req.body;
            cacheKey = `${req.path}:${tags?.toString()?.split(',')?.join('_')}:${pageNumber}:${pageSize}`;
            break;
        case '/convertTextToTags':
            const { text } = req.body;
            cacheKey = `${req.path}:${text}`;
            break;
        case '/autocomplete':
            const { query } = req.query;
            cacheKey = `${req.path}:${query}`;
            break;
        default:
            break;
    }

    if (cacheKey) {
        res.locals.cacheKey = cacheKey;
    }

    next();
};

export default createCacheKeyMiddleware;