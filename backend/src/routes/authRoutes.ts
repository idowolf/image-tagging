/**
 * @fileoverview Defines the routes for user authentication.
 */

import { Router } from 'express';
import { loginUser, loginWithGoogle, registerUser } from '../controllers/authController';
import { completeProfile } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route POST /api/auth/register
 * @body {string} fullName - The full name of the user.
 * @body {string} email - The email address of the user.
 * @body {string} password - The password of the user.
 * @body {string} department - The department of the user.
 * @body {string} team - The team of the user.
 * @body {string} role - The role of the user.
 */
router.post('/register', registerUser);

/**
 * @route POST /api/auth/login
 * @body {string} email - The email address of the user.
 * @body {string} password - The password of the user.
 */
router.post('/login', loginUser);

/**
 * @route GET /api/auth/google
 * @description Initiates Google OAuth authentication.
 */
router.post('/google', loginWithGoogle);

/**
 * @route POST /api/auth/complete-profile
 * @body {string} userId - The ID of the user.
 * @body {string} department - The department of the user.
 * @body {string} team - The team of the user.
 * @body {string} role - The role of the user.
 */
router.post('/complete-profile', authMiddleware, completeProfile);

router.get('/profile', authMiddleware, (req, res) => { res.status(200).json(req.user); });

export default router;
