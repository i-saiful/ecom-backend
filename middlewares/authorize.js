const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    const token = req.header('authorization');
    if (token) {
        try {
            const decoded = jwt.verify(
                token.split(' ')[1].trim(),
                process.env.JWT_SECRET_KEY
            )
            req.user = decoded
            next();
        }
        catch (e) {
            return res.status(400).send('Invalid token');
        }
    } else {
        return res.status(401).send('Access Denied!, no token provied!');
    }
}