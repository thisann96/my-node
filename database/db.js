const mongoose = require('mongoose');

const connectDB = async()=>{
    try {
        console.log(process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Mongo DB is connected');
    } catch (error) {
        console.error('MongoDb connection fail ',error);
        process.exit(1);
    }
}

module.exports = connectDB;