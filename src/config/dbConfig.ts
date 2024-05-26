import mongoose from 'mongoose';

const connectToDatabase = async (url: string) => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err);
    }
};

export default connectToDatabase;
