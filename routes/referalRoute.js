const express = require('express');
const auth = require('../validation/verifywebtoken');
const router = express.Router();

const referalModel= require('../models/referals');


router.post('/makereferal', async (req, res) => {

    const refData = new referalModel({
        refered_by:req.body.refered_by,
        refered_person:req.body.refered_person
    });

    try {
        const saveProducts = await refData.save();
        res.json(saveProducts);
    } catch (err) {
        res.json({ error: err });
    }
});

router.get('/:referalKey', auth, async (req, res) => {
    try {
        const referal = await referalModel.find({"refered_by":req.params.referalKey}).populate('refered_person');
        return res.json({referal: referal});

    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
