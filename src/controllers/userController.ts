/**
 * @fileoverview Contains controller functions for handling user profile completion.
 */
import { Request, Response } from 'express';
import User from '../models/User';

/**
 * Completes the user profile with additional information.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @body {string} userId - The ID of the user.
 * @body {string} department - The department of the user.
 * @body {string} team - The team of the user.
 * @body {string} role - The role of the user.
 */
export const completeProfile = async (req: Request, res: Response) => {
  const { userId, department, team, role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { department, team, role }, { new: true });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
