require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const jwt = require('jsonwebtoken');

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const userRouter = require('./routes/user');
const Workspace = require('./models/workspace');
const User = require('./models/user');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * For every /user/ request, verifies JWT
 */
const verifyJwt = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send(JSON.stringify('UNAUTHORISED'))
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch(e) {
        res.status(400).send(JSON.stringify('INVALID TOKEN'));
    }
}

/**
 * For every request, makes sure that the user accessing that user's files has authorisation
 */
const checkAuthorised = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send(JSON.stringify('UNAUTHORISED'))
    User.findOne({username: req.params.username})
    .then(user => {
        const userId = user._id;
        const decodedId = jwt.verify(token, process.env.SECRET_KEY).id;
        if (userId == decodedId) {
            next();
        } else {
            res.status(401).send(JSON.stringify('UNAUTHORISED'))
        }
    })
    .catch(err => {
        res.status(400).send(JSON.stringify('INVALID TOKEN'));
    })
}

/**
 * For every request, makes sure that the user accessing that user's workspaces has authorisation
 */
const checkAuthorisedWorkspace = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send(JSON.stringify('UNAUTHORISED'))
    Workspace.findById(req.params.id)
    .then(workspace => {
        const decodedId = jwt.verify(token, process.env.SECRET_KEY).id;
        if (workspace.owner == decodedId) {
            next();
        } else {
            res.status(401).send(JSON.stringify('UNAUTHORISED'));
        }
    })
    .catch(err => {
        res.status(400).send(JSON.stringify('INVALID TOKEN'));
    })
}

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/user/', verifyJwt);
app.use('/user/:username', checkAuthorised);
app.use('/user/:username/:id', checkAuthorisedWorkspace);
app.use('/user', userRouter);

module.exports = app;
