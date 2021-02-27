var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Workspace = require('../models/workspace');
const Group = require('../models/group');
const Item = require('../models/item');

//MongoDB details
const URI = process.env.URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

/**
 * @todo convert all callbacks to promises
 */

router.get('/', (req, res) => {
    const token = req.headers['x-access-token'];
    //If no token, returns 401
    if (!token) return res.status(401).send(JSON.stringify({ auth: false, message: 'No token provided.' }));

    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send(JSON.stringify({ auth: false, message: 'Failed to authenticate token.' }));
        User.findById(decoded.id, { password: 0 }).populate({path: 'workspaces'}).exec()
        .then(obj => res.send(obj))
        .catch(err => {
          console.log(err);
          res.status(500).send(err);
        });
    });
});

router.post('/:username', (req, res) => {
  const token = req.headers['x-access-token'];
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
    mongoose.connect(URI, options)
    .then(() => Group.create({ owner: decoded.id, title: 'Main'}))
    .then(newGroup => Workspace.create({
      owner: decoded.id,
      title: req.body.newWorkspace.title,
      description: req.body.newWorkspace.description,
      groups: [newGroup._id]
    }))
    .then(workspace => {
      return User.findById(decoded.id).updateOne({
        $push: { workspaces: workspace._id }
      })
    })
    .then(() => getUpdatedDashboard(req.body.user_id))
    .then(obj => res.send(obj))
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
  })
})

router.delete('/:username', (req, res) => {
  const token = req.headers['x-access-token'];
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
    mongoose.connect(URI, options)
    .then(() => Workspace.findByIdAndDelete(req.body.workspace_id))
    .then(() => User.findById(decoded.id).updateOne({
      $pull: { workspaces: req.body.workspace_id }
    }))
    .then(() => getUpdatedDashboard(decoded.id))
    .then(obj => res.send(obj))
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
  })
})

const getUpdatedWorkspace = id => {
  return Workspace.findOne({'_id': id}).populate({
    path: 'groups',
    populate: {
      path: 'items'
    }
  }).exec()
}

const getUpdatedDashboard = id => {
  return User.findOne({'_id': id}).populate({
    path: 'workspaces',
    populate: {
      path: 'groups',
      populate: {
        path: 'items'
      }
    }
  }).exec()
}

router.get('/:username/:id', (req, res) => {
  mongoose.connect(URI, options)
  .then(() => getUpdatedWorkspace(req.params.id))
  .then(obj => res.send(obj))
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

router.post('/:username/:id', (req, res) => {
  const token = req.headers['x-access-token'];
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
    mongoose.connect(URI, options)
    .then(() => Item.create({...req.body.newItem, owner: decoded.id}))
    .then(item => Group.findOne({'_id': req.body.group_id}).updateOne({
      $push: { items: item._id}
    }))
    .then(() => getUpdatedWorkspace(req.params.id))
    .then(obj => res.send(JSON.stringify(obj)))
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
  })
});

const validateGroup = (group_id, decodedId) => {
  return Group.findById(group_id)
  .then(group => {
    if (group.owner == decodedId) {
      return group;
    } else {
      return res.status(401).send(JSON.stringify('UNAUTHORISED'));
    }
  })
}

router.delete('/:username/:id', (req, res) => {
  const token = req.headers['x-access-token'];
  const decodedId = jwt.verify(token, process.env.SECRET_KEY).id;
  mongoose.connect(URI, options)
  .then(() => validateGroup(req.body.group_id, decodedId))
  .then(group => Group.findById(group._id).updateOne({
    $pull: { items: req.body.item_id }
  }))
  .then(() => Item.findById(req.body.item_id).deleteOne())
  .then(() => getUpdatedWorkspace(req.params.id))
  .then(obj => res.send(JSON.stringify(obj)))
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

router.put('/:username/:id', (req, res) => {
  mongoose.connect(URI, options)
  .then(() => Item.findById(req.body.id).updateOne(req.body.item))
  .then(() => getUpdatedWorkspace(req.params.id))
  .then(obj => res.send(JSON.stringify(obj)))
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
});

module.exports = router;
