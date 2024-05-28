/**
 * @fileoverview Configures the Passport strategy for Google OAuth authentication.
 */

import passport from 'passport';
import User from '../models/User';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
