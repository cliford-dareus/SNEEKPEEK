import mongoose from 'mongoose';
mongoose.set('strictQuery', false)

const connectDB = (uri: string) => {
    return mongoose.connect(uri);
}

export default connectDB;