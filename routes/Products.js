const express = require('express');

const productModel = require('../models/products');
const auth = require('../validation/verifywebtoken');
const postverify = require('../validation/postverify');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }

}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (err) {
        res.json({ error: err })
    }
});

router.post('/', auth, upload.single("file"), async (req, res) => {
    console.log(req.file);
    const productsData = new productModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.file.path,
        user: req.user._id,
    });

    try {
        const saveProducts = await productsData.save();
        res.json(saveProducts);
    } catch (err) {
        res.json({ error: err });
    }

});


router.get('/:productId', async (req, res) => {
    console.log(req.params.productId);
    try {
        const product = await productModel.findById(req.params.productId);
        res.json({ body: product });
    } catch (err) {
        res.json({ error: err })
    }

});

//Delete Products
router.delete('/:productId', async (req, res) => {
    try {
        const deletedproduct = await productModel.remove({ _id: req.params.productId });
        res.json(deletedproduct)

    } catch (err) {
        res.json({ error: err })
    }
});

//update Products
router.patch('/:productId', async (req, res) => {
    try {
        const updated = await productModel.updateOne({ _id: req.params.productId }, { $set: { name: req.body.name } });
        res.json(updated)

    } catch (err) {
        res.json({ error: err })
    }
})

module.exports = router;


