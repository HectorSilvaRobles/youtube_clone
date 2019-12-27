const express = require('express');
require('dotenv').config();


const app = express();


// Connecting Mongoose DataBase
const mongoose = require('mongoose');
const {MONGOODB, PORT} = process.env;
mongoose.connect(`${MONGOODB}`, {useNewUrlParser: true})
    .then(()=> console.log('DB connected'))
    .catch(err => console.error('there was error', err))


// Endpoints
app.get('/', (req, res) =>{
    console.log('hit')
    res.send(MONGOODB)
});

app.listen(PORT);