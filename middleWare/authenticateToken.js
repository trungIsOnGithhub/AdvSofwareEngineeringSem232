const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers?.authorization?.split(' ')[1];
    console.log(token)
    const secret = '33e63cdbf2c1b7c12bdef634d08f82bedc42a252963dfade0401af3c354cf3fa'
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, secret , (err, user) => {
        // console.log(err)
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;