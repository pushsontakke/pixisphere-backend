const mongoose = require('mongoose');
const {mongo} = require("mongoose");

const inquirySchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date:{
        type: Date,
        required: true,
    },
    budget: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    referenceImageURL: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i, 'Please enter a valid image URL']
    },
    status: {
        type: String,
        enum: ['new', 'responded', 'booked', 'closed'],
        default: 'new'
    },
    assignedPartnerIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });

inquirySchema.index({ category: 1 });
inquirySchema.index({ city: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ 'clientId': 1 });
inquirySchema.index({ 'assignedPartnerIds': 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);