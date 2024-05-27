import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import passport from 'passport';
import User from '../models/User';

passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: '/api/auth/google/callback'
},
async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      if (!profile.emails || !profile.emails[0].value) {
        return done(new Error('No email found'), undefined);
      }
      user = new User({
        googleId: profile.id,
        fullName: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null, // Add null check for profile.emails
        // Other fields can be left blank initially
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, undefined);
  }
}));

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
