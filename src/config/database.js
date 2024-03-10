const mongoose = require('mongoose');


const connectDatabase = () => {
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@paymentcluster0.g5qq2u3.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_CLUSTER}`)
};


mongoose.connection.on('connect', () => {
    console.log('[db] connected to mongoDB successfully')
});

mongoose.connection.once('open', () => {
    console.log('[db] connected to mongoDB successfully')
});

mongoose.connection.on('disconnected', () => {
    console.log('[db] mongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
    console.log(`[db] mongoDB connection error : ${error}`)
});

module.exports = connectDatabase;