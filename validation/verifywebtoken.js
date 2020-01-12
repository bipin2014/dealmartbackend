const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('AUTH-TOKEN');
    if (!token) return res.send("Access Denied");
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req.user);
        next();
    } catch (err) {
        return res.json(err);
    }
}