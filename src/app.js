const dotenv       = require('dotenv');
dotenv.config();
const PORT         = process.env.POST || 8000;
const express      = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));


// import routes
const user        = require('./routes/userRoute');
const transaction = require('./routes/transactionRoute')


// url routing
app.use('/api/v1', user);
app.use('/api/v1/transactions', transaction)


app.get('/', (req, res) => {
    res.send(`server is running on port ${PORT} 🚀`);
})

module.exports = app;