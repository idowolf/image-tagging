import { Request, Response } from 'express';
import User from '../models/User';

export const completeProfile = async (req: Request, res: Response) => {
  const { userId, department, team, role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { department, team, role }, { new: true });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
