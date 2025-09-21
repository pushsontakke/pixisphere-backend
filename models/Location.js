const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['city', 'state', 'country'], // Basic hierarchy
        default: 'city',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Location', locationSchema);
