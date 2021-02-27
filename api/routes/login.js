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
    mongoose.connect(URI, options)
      User.findOne({ username: req.body.username })
      .then(user => {
          if (user === null) {
            res.status(404).send(JSON.stringify('No user found.'));
          }
          else {
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) return res.status(401).send(JSON.stringify({ auth: false, token: null }));
            var token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: 3600
              });
              
              res.status(200).send(JSON.stringify({ auth: true, token: token }));
          }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});



module.exports = router;
