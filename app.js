require('dotenv').config();

var express = require('express');
var app = express();
var db = require('./db');

db.sync();

app.use(require('body-parser').json());
app.use(require('./middleware/headers'));
app.use('/user', require('./controllers/user-controller'));
app.use('/channel', require('./controllers/channel-controller'));

app.listen(process.env.PORT || 8080, () => console.log(`app is listening on port ${process.env.PORT || 8080}`));
