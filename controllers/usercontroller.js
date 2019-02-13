const express = require('express');
const user = express.Router();

/*  /user  */
user.post('/', (req, res) => {
    res.send('you created a user')
})
user.put('/', (req, res) => {
    res.send('you updated a user')
})
user.delete('/', (req, res) => {
    res.send('you deleted a user')
})

/*  /user/:id  */
user.get('/:id', (req, res) => {
    res.send('you got a specific user')
})

/*  /user/login  */
user.put('/login', (req, res) => {
    res.send('you logged in')
}) 

/*  /user/channels/all/:id  */
user.get('/channels/all/:id', (req, res) => {
    res.send('you got all channels for a user')
})

/*  USER MESSAGES CONTROLLER  */
const userMessage = express.Router();
user.use('/message', userMessage)

/*  /user/message/  */
userMessage.post('/', (req, res) => {
    res.send('you sent a direct message')
})

/*  /user/message/:id  */
userMessage.put('/:id', (req, res) => {
    res.send('you updated a direct message')
})
userMessage.delete('/:id', (req, res) => {
    res.send('you deleted a direct message')
})

/*  /user/message/all/:id  */
userMessage.get('/all/:id', (req, res) => {
    res.send('you got all messages between you and another user')
})

module.exports = user;