import { Router } from 'express';
import passport from 'passport';
import { loginUser, registerUser } from '../controllers/authController';
import { completeProfile } from '../controllers/userController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home or to complete profile if needed.
    res.redirect('/profile'); // Adjust the path as needed
  }
);

router.post('/complete-profile', completeProfile);

export default router;
