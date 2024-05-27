/**
 * @fileoverview Middleware for handling user authentication via JWT.
 */

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/appConfig';
import User from '../models/User';

/**
 * Middleware function to authenticate a user via JWT.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token, no userId found' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    (req as any).user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid token' });
  }
};