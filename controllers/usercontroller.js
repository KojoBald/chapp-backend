const express = require('express'); 
const user = express.Router();
var db = require('../db');
var User = db.import('../models/users');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

/*  /user  */
user.post('/Create', (req, res) => 
{
    const userobj =
    {
        username: req.body.user.username,
        password_hash: bcrypt.hashSync(req.body.user.password_hash, 10),
        email: req.body.user.email,
        image: req.body.user.image,
        first: req.body.user.first,
        last: req.body.user.last
    }
    User.create(userobj)
    .then(user => 
        {
            var token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24})
            res.status(200).json(
                {
                    user: user,
                    message: 'user created',
                    token: token
                })
        })
})

user.put('/update/:id', (req, res) => 
{
    User.update(
        {
            username: req.body.user.username,
            password_hash: req.body.user.password_hash,
            email: req.body.user.email,
            image: req.body.user.image,
            first: req.body.user.first,
            last: req.body.user.last,
            channel: req.body.user.channel
        },
        {
            where:
                {
                    id: req.params.id
                }
        })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({error: err}))
})

user.delete('/delete/:id', (req, res) => 
{
    User.destroy({where:{id: req.params.id}})
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({error: err}))
})

/*  /user/:id  */
user.get('/:id', (req, res) => 
{
    User.findOne({where:{ id: req.params.id}})
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({error: err}))
})

/*  /user/login  */
user.put('/login', (req, res) => 
{
    User.findOne({where:{username:req.body.user.username}})
    .then(user => 
    {
        if(user)
        {
            bcrypt.compare(req.body.user.password_hash, user.password_hash, 
            function(err, matches)
            {
                if(matches)
                {
                    var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})
                    res.json(
                        {
                            user: user,
                            message: 'successful authentification',
                            sessionToken: token
                        })
                }else
                {
                    res.status(502).send({error: "failed"})
                }
            })
        }else
        {
            res.status(500).send({error: "failed to authentiate"})
        }
    })
}) 

/*  /user/channels/all/:id  */
user.get('/channels/all/:id', (req, res) => 
{
    User.findOne(
    {
        where:
            {
                id: req.params.id
            },
    })
    .then(sheets => res.status(200).json(sheets))
    .catch(err => res.status(500).json({error: err}))
})

/*  USER MESSAGES CONTROLLER  */
const userMessage = express.Router();
user.use('/message', userMessage)

/*  /user/message/  */
userMessage.post('/create/:id', (req, res) => 
{
    
})

/*  /user/message/:id  */
userMessage.put('/:id', (req, res) => 
{
    res.send('you updated a direct message')
})

userMessage.delete('/:id', (req, res) => 
{
    res.send('you deleted a direct message')
})

/*  /user/message/all/:id  */
userMessage.get('/all/:id', (req, res) => 
{
    res.send('you got all messages between you and another user')
})

module.exports = user;