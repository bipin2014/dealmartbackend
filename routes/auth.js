const express = require('express');

const userModel = require('../models/users');

const router = express.Router();

const auth = require('../validation/verifywebtoken');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const { registerValidation, loginValidation } = require('../validation/userdetail');



router.post('/signup', async (req, res) => {

    //Validation
    const { error } = registerValidation(req.body);
    if (error)  res.status(400).json({ error: error.details[0].message });

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
        res.json(savedUser);
    } catch (err) {
        res.json({ error: err });
    }

});

router.post('/login', async (req, res) => {
    //Validation
    const { error } = loginValidation(req.body);
    if (error)  res.json({ error: error.details[0].message });
    const user = await userModel.findOne({ email: req.body.email });
    if (!user)  res.json({ error: "Email is incorrect" });

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

router.get('/getUser',auth,async (req,res)=>{
    if(req.user._id){
        const user=await userModel.findById(req.user._id);
        return res.json({credentials:user})
    }else{
        return res.json({"error":"Please Login"})
        
    }
})

module.exports = router;