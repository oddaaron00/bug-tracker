var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const URI = process.env.URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

router.post('/', function(req, res, next) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    mongoose.connect(URI, options)
    .then(() => User.findOne({username: req.body.username}))
    .then(user => {
        if (user !== null) {
            return res.status(409).send('SORRY');
        }
        else {
            User.create({
                username: req.body.username,
                password: hashedPassword
            })
            .then(newUser => {
                const token = jwt.sign({id: newUser._id }, process.env.SECRET_KEY, {
                    expiresIn: 3600
                });
                return token;
            })
            .then(token => res.status(200).send(JSON.stringify({ auth: true, token: token })))
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});



module.exports = router;
