const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

const signup = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const allowedRoles = ['client', 'partner'];
        const userRole = allowedRoles.includes(role) ? role : 'client';

        const user = await User.create({
            email: email.toLowerCase(),
            password,
            role: userRole
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            }
        });
        console.log(` [MOCK] OTP sent to email ${email} : ${process.env.OTP_CODE}`);
    } catch (error) {
        console.error('Signup Error:', error.message);
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error during signup' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'login successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    }catch(err){
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error during login' });
    }
}

module.exports = {
    signup,
    login
}

