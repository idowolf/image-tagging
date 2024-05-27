/**
 * @fileoverview Defines the routes for user authentication.
 */

import { Router } from 'express';
import passport from 'passport';
import { loginUser, registerUser } from '../controllers/authController';
import { completeProfile } from '../controllers/userController';

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
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route GET /api/auth/google/callback
 * @description Handles the callback after Google OAuth authentication.
 */
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home or to complete profile if needed.
    res.redirect('/profile'); // Adjust the path as needed
  }
);

/**
 * @route POST /api/auth/complete-profile
 * @body {string} userId - The ID of the user.
 * @body {string} department - The department of the user.
 * @body {string} team - The team of the user.
 * @body {string} role - The role of the user.
 */
router.post('/complete-profile', completeProfile);

export default router;
