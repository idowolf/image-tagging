/**
 * @fileoverview The main entry point of the server application.
 */

import app, { CLIENT_APP_URL, MONGO_DB_URI, SERVER_PORT, SESSION_SECRET } from './config/appConfig';
import connectToDatabase from './config/dbConfig';
import imageRoutes from './routes/imageRoutes';
import tagRoutes from './routes/tagRoutes';
import authRoutes from './routes/authRoutes';
import passport from './config/passportConfig';
import session from 'express-session';
import cors from 'cors';
import cookies from 'cookie-parser';
import rateLimit from 'express-rate-limit';

const databaseUrl = `${MONGO_DB_URI}/imageDB`;

connectToDatabase(databaseUrl);
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookies());
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});


app.use(cors({
  origin: CLIENT_APP_URL,
  credentials: true,
}));

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/tags', tagRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`);
});
