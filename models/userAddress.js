const mongoose = require('mongoose');

const userAddressSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    street: String,
    phone: { type: Number, required: true },
});

module.exports = mongoose.model('UserAddress', userAddressSchema);