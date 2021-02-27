const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    workspaces: [{type: Schema.Types.ObjectId, ref:'Workspace'}]
}, { collection: 'Users' });

const User = mongoose.model('User', userSchema);

module.exports = User;