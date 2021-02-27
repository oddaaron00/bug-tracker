const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Schema for the item:
 * User > Workspace > Group > ITEM
 */
const itemSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    description: String,
    creation_date: Date,
    due_date: Date,
    priority: String,
    status: String,
}, { collection: 'Items' });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;