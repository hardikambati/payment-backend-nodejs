const dotenv       = require('dotenv');
dotenv.config();
const PORT         = process.env.POST || 8000;
const express      = require('express');
const cors         = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(
    cors({
      origin: 'http://localhost:3000',
      preflightContinue: true,
    }),
);

// import routes
const user        = require('./routes/userRoute');
const transaction = require('./routes/transactionRoute');
const external    = require('./routes/externalRoute');
const wallet      = require('./routes/walletRoute');


// url routing
app.use('/api/v1', user);
app.use('/api/v1/transactions', transaction);
app.use('/api/v1/external', external);
app.use('/api/v1/wallet', wallet);


app.get('/', (req, res) => {
    res.send(`server is running on port ${PORT} 🚀`);
})

module.exports = app;