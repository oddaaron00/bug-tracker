var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//MongoDB details
const URI = process.env.URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

/**
 * POST /login
 * @param {object} res.body
 * @param {string} res.body.username user's username
 * @param {string} res.body.password user's unencrypted password
 */
router.post('/', (req, res) => {
    mongoose.connect(URI, options)
      //Find user by username
      User.findOne({ username: req.body.username })
      .then(user => {
          if (user === null) {
            //If user doesn't exist, send 404
            res.status(404).send(JSON.stringify('No user found.'));
          }
          else {
            //If user exists, compare user's encrypted password with encrypted password in database
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            //If passwords don't match, send 401 with no token
            if (!passwordIsValid) return res.status(401).send(JSON.stringify({ auth: false, token: null }));
            //If passwords match, sign token and send 200 with token
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: 3600 });
            
            res.status(200).send(JSON.stringify({ auth: true, token: token }));
          }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});

module.exports = router;
