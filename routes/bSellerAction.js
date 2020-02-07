const express = require('express');
const router = express.Router();
const bsModel = require('../models/becomeSeller');

const auth = require('../validation/verifywebtoken');


router.post('/apply', auth, async (req, res) => {

    const checkprevdata = await bsModel.findOne({ user: req.user._id });
    if (checkprevdata) {
        return res.json({ message: "Already applied" })
    }

    const bsData = new bsModel({
        user: req.user._id,
        pan: req.body.pan,
        phone: req.body.phone
    });

    try {
        const saveDetails = await bsData.save();
        res.json(saveDetails);
    } catch (err) {
        res.json({ error: err });
    }
});

router.get('/get', auth, async (req, res) => {

    try {
        const data = await bsModel.findOne({ user: req.user._id });
        if (data) {
            return res.json({ message: data })
        }
    } catch (err) {
        res.json({ error: err });
    }
});

router.get('/getAll', auth, async (req, res) => {

    try {
        const data = await bsModel.find().populate("user");
        return res.json({ data })

    } catch (err) {
        res.json({ error: err });
    }
});

//Delete Bs
router.delete('/:userId',auth, async (req, res) => {
    try {
        const deletedbs = await bsModel.remove({user: req.params.userId});
        res.json(deletedbs)
    } catch (err) {
        res.json({error: err})
    }
});

module.exports = router;