const express = require('express');

const userModel = require('../models/users');

const router = express.Router();

const auth = require('../validation/verifywebtoken');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const bsModel = require('../models/becomeSeller')


const { registerValidation, loginValidation } = require('../validation/userdetail');

const referalModel= require('../models/referals');



router.post('/signup', async (req, res) => {

    if(req.body.referal!==""){
        const validReferalKey=await userModel.findOne({ referalKey: req.body.referal })
        if (!validReferalKey) return res.json({ error: "Referal is Incorrect. Please Check" });
    }

    //Validation
    // const { error } = registerValidation(req.body);
    // if (error) return res.json({ error: error.details[0].message });

    const emailExists = await userModel.findOne({ email: req.body.email });
    if (emailExists) return res.json({ error: "Email is alrady registerd" });

    if (req.body.password !== req.body.confirmPassword) return res.json({ error: "Password does not match" });

    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(req.body.password, salt);

    const userData = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hasedPassword
    });

    try {
        const savedUser = await userData.save();
        // res.json(savedUser._id);
        if(req.body.referal!==""){
            addReferal(savedUser._id,req.body.referal);
            const userpointtoadd = await userModel.findOne({ referalKey: req.body.referal });
            console.log("Point ",userpointtoadd.rewardPoint+5);
            
            addReferalPoint(req.body.referal,userpointtoadd.rewardPoint+5)
        }
            
        return res.json(savedUser);
    } catch (err) {
        res.json({ error: err });
    }

});

router.post('/login', async (req, res) => {
    //Validation
    const { error } = loginValidation(req.body);
    if (error) res.json({ error: error.details[0].message });
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) res.json({ error: "Email is incorrect" });

    //Check Password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.json({ error: "Incorrect Password" });
    }
    else {
        const token = jwt.sign({ _id: user._id, email: user.email, name: user.name }, process.env.TOKEN_SECRET);
        // res.header('AUTH-TOKEN', token);
        return res.json({ token: token });
    }
});

router.get('/getUser', auth, async (req, res) => {
    if (req.user._id) {
        const user = await userModel.findById(req.user._id);
        return res.json({ credentials: user })
    } else {
        return res.json({ "error": "Please Login" })

    }
});


//make Seller
router.patch('/makeSeller/:userId', async (req, res) => {
    try {
        const updated = await userModel.updateOne({ _id: req.params.userId }, { $set: { usertype: "Seller" } });
        if (updated) {
            await bsModel.deleteOne({ user: req.params.userId });
        }
        res.json(updated);

    } catch (err) {
        res.json({ error: err })
    }
});

//update reward point with product
router.patch('/add/rewardPoints', auth, async (req, res) => {
    try {
        const updated = await userModel.updateOne({ _id: req.user._id }, { $set: { rewardPoint: req.body.points } });
        res.json(updated);
    } catch (err) {
        res.json({ error: err })
    }
});



//update referkey
router.patch('/add/referalkey', auth, async (req, res) => {
    console.log(req.body.referalKey);

    try {
        const referalExists = await userModel.findOne({ referalKey: req.body.referalKey });
        if (referalExists) return res.json({ error: "Referal Key is alrady taken" });
        const updated = await userModel.updateOne({ _id: req.user._id }, { referalKey: req.body.referalKey });
        res.json(updated);
    } catch (err) {
        res.json({ error: err })
    }
});

//update reward point with refer
const addReferalPoint=async (referalKey,rp)=>{
    try {
        const updated = await userModel.updateOne({ referalKey: referalKey }, { $set: { rewardPoint: rp } });
        res.json(updated);
    } catch (err) {
        res.json({ error: err })
    }
}


const addReferal=async (refered_person,refered_by)=>{
    const refData = new referalModel({
        refered_by:refered_by,
        refered_person:refered_person
    });

    try {
        const saveProducts = await refData.save();
    } catch (err) {
        res.json({ error: err });
    }
}

module.exports = router;