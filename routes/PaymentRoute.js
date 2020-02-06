const express = require('express');
const auth = require('../validation/verifywebtoken');
const router = express.Router();

const paymentModel= require('../models/payment');

router.post('/makePayment', auth, async (req, res) => {

    const orderData = new paymentModel({
        user: req.user._id,
        paymentType: req.body.paymentType,
        paymentStatus: req.body.paymentStatus,
        amount:req.body.amount
    });

    try {
        const saveProducts = await orderData.save();
        res.json(saveProducts);
    } catch (err) {
        res.json({ error: err });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const payment = await paymentModel.find({"user":req.user._id}).populate('user');
        return res.json({payment: payment});

    } catch (e) {
        console.log(e);
    }
});

module.exports = router;