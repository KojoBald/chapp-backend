require('dotenv').config();
var express = require('express');
var app = express();
var db = require('./db');

db.sync();

app.listen(process.env.PORT, function()
{
    console.log(`app is listening on ${process.env.PORT}`)
});