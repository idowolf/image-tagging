import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Ensure you have a User model defined
import { JWT_SECRET } from '../config/appConfig';

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

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
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