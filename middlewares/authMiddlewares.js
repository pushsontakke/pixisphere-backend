
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwtUtils');

const protect = async (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            const decoded = verifyToken(token);
            // console.log('Decoded JWT:', decoded);
            const currentUser = await User.findById(decoded.id);
            if(!currentUser){
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = currentUser;
            next();
        } catch(error){
            console.log('Token Verification Error:', error.message);
            return res.status(401).json({ message: 'Not Authorized, Token failed' });
        }
    }
    if(!token){
        return res.status(401).json({ message: 'Not Authorized, No token' });
    }
}

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ message: 'Not Authorized, Role not allowed' });
        }
        next();
    };
};

module.exports = { protect, restrictTo };