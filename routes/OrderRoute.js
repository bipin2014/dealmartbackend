const express = require('express');
const auth = require('../validation/verifywebtoken');
const router = express.Router();

const orderModel = require('../models/order');
const cartModel = require('../models/cart');

router.post('/makeOrder', auth, async (req, res) => {

    const orderData = new orderModel({
        user: req.user._id,
        products: req.body.products,
        payment:req.body.paymentId,
    });

    try {
        const saveProducts = await orderData.save();
        return res.json(saveProducts);
    } catch (err) {
        return res.json({ error: err });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const order = await orderModel.find({"user":req.user._id}).populate('payment').populate('products.product');
        return res.json({order: order});

    } catch (e) {
        console.log(e);
    }
});


module.exports = router;
