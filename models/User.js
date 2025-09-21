const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true,
        enum: ['client', 'partner', 'admin',],
        default: 'client'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    partnerProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartnerProfile',
    }
},
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    try{
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salf);
    } catch(error){
        return next(error);
    }
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    try{
        return await bcrypt.compare(enteredPassword, this.password);
    } catch(error){
        throw error;
    }
}

module.exports = mongoose.model('User', userSchema);