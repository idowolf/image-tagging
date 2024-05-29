/**
 * @fileoverview Contains controller functions for user authentication.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { GOOGLE_OAUTH2_CLIENT_ID, GOOGLE_OAUTH2_CLIENT_SECRET, JWT_SECRET } from '../config/appConfig';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(GOOGLE_OAUTH2_CLIENT_ID, GOOGLE_OAUTH2_CLIENT_SECRET);
const jwtExpiration = '1h';
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: jwtExpiration });

    res.status(200).json({ token });
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: jwtExpiration });

    res.status(200).json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Authenticates a user using Google login.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing a token if the authentication is successful, or an error message if it fails.
 */
export const loginWithGoogle = async (req: Request, res: Response) => {
  const { credential, client_id } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: client_id,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }
    const { email, sub, name } = payload;
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        fullName: name,
      });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: jwtExpiration });
    res.json({ token });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(400).json({ error: 'Invalid Google token' });
  }
}