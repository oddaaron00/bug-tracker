var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//MongoDB details
const URI = process.env.URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

/**
 * POST /register
 * @param {string} req.body.username user's username
 * @param {string} req.body.password user's unencrypted password
 */
router.post('/', (req, res) => {
    //Encrypts password
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    mongoose.connect(URI, options)
    //Finds user by username
    .then(() => User.findOne({username: req.body.username}))
    .then(user => {
        if (user !== null) {
            //If user already exists, sends 409
            return res.status(409).send('SORRY');
        }
        else {
            //Creates user using User schema
            User.create({
                username: req.body.username,
                password: hashedPassword
            })
            .then(newUser => {
                //Signs token containing user ID
                const token = jwt.sign({id: newUser._id }, process.env.SECRET_KEY, { expiresIn: 3600 });
                return token;
            })
            //Sends 200 with token
            .then(token => res.status(200).send(JSON.stringify({ auth: true, token: token })));
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});



module.exports = router;
