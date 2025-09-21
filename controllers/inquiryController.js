const inquiry = require('../models/Inquiry');
const PartnerProfile = require('../models/PartnerProfile');
const User = require('../models/User');

const submitInquiry = async (req, res) => {
    const { category, date, budget, city, referenceImageURL } = req.body;
    const clientId = req.user.id;

    if (!category || !date || !budget || !city) {
        return res.status(400).json({ message: 'Category, date, budget, and city are required.' });
    }

    try {
        const client = await User.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client user not found' });
        }
        if (client.role !== 'client') {
            return res.status(403).json({ message: 'Access denied. Not a client.' });
        }

        const inquiryData = {
            clientId,
            category: category.trim(),
            date: new Date(date),
            budget: Number(budget),
            city: city.trim(),
            referenceImageURL: referenceImageURL ? referenceImageURL.trim() : undefined,

        };
        const inquiry = new Inquiry(inquiryData);
        const savedInquiry = await inquiry.save();

        const matchingPartners = await PartnerProfile.find({
            verificationStatus: 'verified',
            $or: [
                { 'serviceDetails.categories': { $regex: new RegExp(category, 'i') } },
                { 'serviceDetails.locations': { $regex: new RegExp(city, 'i') } }
            ]
        }).populate('user', '_id');

        const partnerIdsToAssign = matchingPartners
            .map(profile => profile.user._id)
            .filter(id => id.toString() !== clientId.toString());

        if (partnerIdsToAssign.length > 0) {
            savedInquiry.assignedPartnerIds = partnerIdsToAssign;
            await savedInquiry.save();
        }
        console.log(`Inquiry ${savedInquiry._id} assigned to ${partnerIdsToAssign.length} partners.`);

        res.status(201).json({
            message: 'Inquiry submitted successfully',
            inquiry: savedInquiry,
        });
    } catch (err) {
        console.error('Submit Inquiry Error:', err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (err.name === 'CastError' && err.path === 'date') {
            return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD or a valid date string.' });
        }
        res.status(500).json({ message: 'Server error during inquiry submission' });
    }
}


const getPartnerLeads = async (req, res) => {
    const partnerId = req.user.id;

    try {
        const partner = await User.findById(partnerId);
        if (!partner) {
            return res.status(404).json({ message: 'Partner user not found' });
        }
        if (partner.role !== 'partner') {
            return res.status(403).json({ message: 'Access denied. Not a partner.' });
        }

        const inquiries = await Inquiry.find({ assignedPartnerIds: partnerId })
            .populate('clientId', 'email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: inquiries.length,
            leads: inquiries,
        });
    } catch (err) {
        console.error('Get Partner Leads Error:', err.message);
        res.status(500).json({ message: 'Server error fetching leads' });
    }
};

module.exports = {
    submitInquiry,
    getPartnerLeads,
};
