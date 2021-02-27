const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Schema for the group:
 * User > Workspace > GROUP > Item
 */
const groupSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    items: [{type: Schema.Types.ObjectId, ref:'Item'}]
}, { collection: 'Groups' });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;