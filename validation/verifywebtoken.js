const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('AUTH-TOKEN');
    if (!token) return res.json({"message":"Please Login to continue"});
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req.user);
        next();
    } catch (err) {
        return res.json(err);
    }
}