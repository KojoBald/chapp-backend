require('dotenv').config();
var express = require('express');
var app = express();
var db = require('./db');
var user = require('./controllers/usercontroller');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

db.sync();

app.use('/user', user); 

app.listen(process.env.PORT, function()
{
    console.log(`app is listening on ${process.env.PORT}`)
});