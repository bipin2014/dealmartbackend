const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users',required:true},
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Products',required: true},
    quantity: {type: Number, default: 1},
    price: {
        type:Number,
        required:true
    },
    total: {
        type:Number,
        required:true
    },
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date}
});

module.exports = mongoose.model("Cart", cartSchema);