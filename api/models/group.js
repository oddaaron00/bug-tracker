const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    items: [{type: Schema.Types.ObjectId, ref:'Item'}]
}, { collection: 'Groups' });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;