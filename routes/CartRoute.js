const express = require('express');
const auth = require('../validation/verifywebtoken');
const router = express.Router();


const productModel= require('../models/products');
const cartModel = require('../models/cart');

router.post('/add', auth, async (req, res) => {

    const checkprevdata=await cartModel.findOne({user: req.user._id, product:req.body.productId});
    if(checkprevdata){
        return  res.json({message:"Already Added to Cart"})
    }

    const cartData = new cartModel({
        user: req.user._id,
        product: req.body.productId,
        quantity: req.body.quantity,
        price: req.body.price,
        total: req.body.total
    });

    try {
        const saveProducts = await cartData.save();
        res.json(saveProducts);
    } catch (err) {
        res.json({error: err});
    }
});



router.get('/', auth, async (req, res) => {
    try {
        const cart = await cartModel.find({"user":req.user._id}).populate('product');
        return res.json({cart: cart});

    } catch (e) {
        console.log(e);
    }
});

router.delete('/remove/:cardId', auth, async (req, res) => {
    try {
        const deletecart = await cartModel.remove({_id: req.params.cardId});
        res.json(deletecart)

    } catch (e) {
        console.log(e);
    }
});

router.delete('/removeall', auth, async (req, res) => {
    try {
        const deletedcart = await cartModel.deleteMany({user:req.user._id});
        res.json(deletedcart);

    } catch (e) {
        console.log(e);
    }
});



module.exports = router;