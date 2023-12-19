import mongoose from 'mongoose'

const connectToMongoDb = async () => {

    try {
        // const port = process.env.MONGO_URI!
        const port = 'mongodb://127.0.0.1:27017/calendar'
        await mongoose.connect(port);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectToMongoDb