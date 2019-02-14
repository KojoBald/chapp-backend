require('dotenv').config();

var express = require('express');
var app = express();
var db = require('./db');

db.sync();

app.use(require('body-parser').json());
app.use(require('./middleware/headers'));
app.use('/user', require('./controllers/usercontroller'));
app.use('/channel', require('./controllers/channelcontroller'));

app.listen(process.env.PORT, function() {
    console.log(`app is listening on ${process.env.PORT}`)
});
