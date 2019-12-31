const express = require('express');
const app = express();
const path = require('path');
const cors =require('cors');

const config = require('./config/key')

require('dotenv').config();
const {MONGOODB, PORT} = process.env;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Connecting Mongoose DataBase
const mongoose = require('mongoose');
// console.log(config)
mongoose.connect(`${MONGOODB}`, { 
    useNewUrlParser: true,
    useCreateIndex: true,
})
.then(()=> console.log('MongooDB connected'))
.catch(err => console.error('there was error', err))


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors())

app.use('/api/users', require('./routes/rUsers'));

const port = process.env.PORT || 6000


app.listen(port, () => console.log(`server running on port ${port}`));