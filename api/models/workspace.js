const mongoose = require('mongoose');
const { Schema } = mongoose;

const workspaceSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, required: false},
    title: {type: String, required: true},
    description: String,
    groups: [{type: Schema.Types.ObjectId, ref: 'Group'}]
}, { collection: 'Workspaces' });

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace;