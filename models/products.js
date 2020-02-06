const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    deliveryCharge: {
        type: Number,
        required: true,
    },
    image: String,
    category:{
        type:[String],
        required:true,
        default:["mobile","laptop"]
    },
    brand: {
        type: String,
        required: true,
    },
    warranty:String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users',required:true},
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Products', ProductSchema);