const PartnerProfile = require('../models/PartnerProfile');
const User = require('../models/User');

const getPendingVerification = async (req, res) => {
    try {
        const pendingProfiles = await PartnerProfile.find({ verificationState: 'pending' }).populate('user', 'email');

        res.status(200).json({ count:pendingProfiles.length, profiles: pendingProfiles });

    } catch (error) {
        console.error('Error fetching pending verification profiles:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

const verifyPartner = async (req, res) => {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if(!['verified', 'rejected'].includes(status)){
        return res.status(400).json({ message: 'Invalid status. Must be either "verified" or "rejected"' });
    }

    try{
        const profile = await PartnerProfile.findById(id).populate('user');
        if(!profile){
            return res.status(404).json({ message: 'Profile not found' });
        }
        profile.verificationStatus = status;
        profile.adminComment = adminComment || '';

        const updatedProfile = await profile.save();

        res.status(200).json({ message: `Profile ${status} updated successfully`, profile: updatedProfile });
    } catch(error){
        console.error('verifyPartner Error:', error.message);
        if( error.name === 'CastError'){
            return res.status(400).json({ message: 'Invalid profile ID format' });
        }
        res.status(500).json({ message: 'Server error during verification' });
    }
}

const getAdminStats = async (req, res) => {
    try{
        const totalClients = await User.countDocuments({ role: 'client' });
        const totalPartners = await User.countDocuments({ role: 'partner' });
        const pendingVerifications = await PartnerProfile.countDocuments({ verificationState: 'pending' });
        const totalInquiries = 0;

        res.status(200).json({
            totalClients,
            totalPartners,
            pendingVerifications,
            totalInquiries
        });
    }catch(error){
        console.error('get admin status Error:', error.message);
        res.status(500).json({ message: 'Server error during fetching admin status' });
    }
};

module.exports = { getPendingVerification, verifyPartner, getAdminStats };