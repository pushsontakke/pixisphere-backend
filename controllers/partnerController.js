const PartnerController = require('../models/PartnerProfile');
const User = require('../models/User');

const submitOnboarding = async (req, res) => {
    const { personalDetails, serviceDetails, documentMetadata, portfolio } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.role !== 'partner'){
            return res.status(403).json({ message: 'Access denied, only partners can submit onboarding' });
        }

        let existingProfile = await PartnerProfile.findOne({ user: userId });
        if(existingProfile){
            if(existingProfile.verificationState !== 'pending'){
                return res.status(400).json({ message: `Profile update not allowed. Status is ${existingProfile.verificationState}.` });
            }

            existingProfile.personalDetails = personalDetails || existingProfile.personalDetails;
            existingProfile.serviceDetails = serviceDetails || existingProfile.serviceDetails;
            existingProfile.documentMetadata = documentMetadata || existingProfile.documentMetadata;

            if(portfolio && Array.isArray(portfolio)){
                existingProfile.portfolio = portfolio;
            }
            if(existingProfile.verificationState === 'rejected'){
                existingProfile.verificationState = 'pending';
                existingProfile.adminComment = "";
            }

            const updatedProfile = await existingProfile.save();
            return res.status(200).json({ message: 'Partner Profile updated successfully', profile: updatedProfile });
        }
        const profileData = {
            user: userId,
            personalDetails: personalDetails || {},
            serviceDetails: serviceDetails || {},
            documentMetadata: documentMetadata || {},
            portfolio: portfolio && Array.isArray(portfolio) ? portfolio : [],
        }

        const profile = new PartnerProfile(profileData);
        const savedProfile = await profile.save();

        user.partnerProfile = savedProfile._id;
        await user.save();

        res.status(201).json({ message: 'Partner Profile created successfully', profile: savedProfile });
    } catch (error) {
        console.error('Error submitting onboarding:', error.message);
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        // Handle duplicate key error if user tries to create another profile
        if(error.code === 11000){
            return res.status(400).json({ message: 'Profile already exists for this user.' });
        }
        res.status(500).json({ message: 'Server error during profile submission' });
    }
}

module.exports = { submitOnboarding };