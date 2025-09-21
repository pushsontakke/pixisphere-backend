
const mongoose = require('mongoose');

const partnerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    personalDetails: {
        firstName: { type: String, trim: true, required: true },
        lastName: { type: String, trim: true, required: true },
        phoneNumber: { type: String, trim: true, required: true },
        dateOfBirth: { type: Date },
        address: { street: String, city: String, state: String, zipCode: String, }
    },
    serviceDetails: {
        categories: [{ type: String, trim: true }],
        locations: [{ type: String, trim: true }],
        experience: { type: Number },
    },
    documentMetadata: {
        aadharNumber: { type: String, trim: true }
    },
    portfolio: [{
        imageUrl: { type: String, required: true },
        description: { type: String },
        orderIndex: { type: Number, default: 0 },
        uploadedAt: { type: Date, default: Date.now }
    }],
    verificationState: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    adminComment: {
        type: String
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

partnerProfileSchema.index({ 'serviceDetails.categories': 1 });
partnerProfileSchema.index({ 'serviceDetails.locations': 1 });
partnerProfileSchema.index({ verificationState: 1 });

// Compound index for matching by category AND location
partnerProfileSchema.index({ 'serviceDetails.categories': 1, 'serviceDetails.locations': 1 });

partnerProfileSchema.index({'Portfolio.orderIndex': 1});

module.exports = mongoose.model('PartnerProfile', partnerProfileSchema);