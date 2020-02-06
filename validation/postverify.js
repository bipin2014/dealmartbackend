const jwt = require('jsonwebtoken');
const userModel = require('../models/users');
const ADMIN = "Seller";

module.exports = async function (req, res, next) {
    const token = req.header('AUTH-TOKEN');
    if (!token) return res.send("Access Denied");
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        const user = await userModel.findById(req.user._id);
        if (user.usertype === ADMIN) next();
        else return res.send("Buyers cannot add Products");
    } catch (err) {
        return res.json(err);
    }
}