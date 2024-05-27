/**
 * @fileoverview Contains controller functions for user authentication.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET } from '../config/appConfig';

/**
 * Registers a new user.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @body {string} fullName - The full name of the user.
 * @body {string} email - The email address of the user.
 * @body {string} password - The password of the user.
 * @body {string} department - The department of the user.
 * @body {string} team - The team of the user.
 * @body {string} role - The role of the user.
 */
export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password, department, team, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      email,
      password: hashedPassword,
      department,
      team,
      role
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Logs in an existing user.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @body {string} email - The email address of the user.
 * @body {string} password - The password of the user.
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const redirectGoogleSignIn = async (req: Request, res: Response) => {
  const user: any = req.user;
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }
  if (!user.fullName || !user.team || !user.department || !user.role) {
    res.redirect('/complete-profile');
    return;
  }
  res.redirect('/home');
}