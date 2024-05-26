import app from './config/appConfig';
import connectToDatabase from './config/dbConfig';
import imageRoutes from './routes/imageRoutes';
import tagRoutes from './routes/tagRoutes';

const url = 'mongodb://localhost:27017/imageDB';

connectToDatabase(url);

app.use('/api/images', imageRoutes);
app.use('/api/tags', tagRoutes);

app.listen(5000, () => {
    console.log('Server started on port 5000');
});
