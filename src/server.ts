import app, { SESSION_SECRET } from './config/appConfig';
import connectToDatabase from './config/dbConfig';
import imageRoutes from './routes/imageRoutes';
import tagRoutes from './routes/tagRoutes';
import authRoutes from './routes/authRoutes';
import passport from './config/passportConfig';
import session from 'express-session';


const url = 'mongodb://localhost:27017/imageDB';

connectToDatabase(url);
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/tags', tagRoutes);

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
