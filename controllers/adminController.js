const PartnerProfile = require('../models/PartnerProfile');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const Category = require('../models/Category');
const Location = require('../models/Location');

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

const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = new Category({ name, description });
        const savedCategory = await category.save();
        res.status(201).json({ message: 'Category created successfully', category: savedCategory });
    } catch (err) {
        console.error('Create Category Error:', err.message);
        if (err.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Category name already exists' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error creating category' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 }); // Sort alphabetically
        res.status(200).json({
            count: categories.length,
            categories
        });
    } catch (err) {
        console.error('Get Categories Error:', err.message);
        res.status(500).json({ message: 'Server error fetching categories' });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (err) {
        console.error('Update Category Error:', err.message);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error updating category' });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Delete Category Error:', err.message);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }
        res.status(500).json({ message: 'Server error deleting category' });
    }
};

const createLocation = async (req, res) => {
    const { name, type } = req.body;

    try {
        const location = new Location({ name, type });
        const savedLocation = await location.save();
        res.status(201).json({ message: 'Location created successfully', location: savedLocation });
    } catch (err) {
        console.error('Create Location Error:', err.message);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Location name already exists' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error creating location' });
    }
};

const getLocations = async (req, res) => {
    try {
        const locations = await Location.find().sort({ name: 1 });
        res.status(200).json({
            count: locations.length,
            locations
        });
    } catch (err) {
        console.error('Get Locations Error:', err.message);
        res.status(500).json({ message: 'Server error fetching locations' });
    }
};

const updateLocation = async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;

    try {
        const location = await Location.findByIdAndUpdate(
            id,
            { name, type },
            { new: true, runValidators: true }
        );

        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json({ message: 'Location updated successfully', location });
    } catch (err) {
        console.error('Update Location Error:', err.message);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Location name already exists' });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid location ID format' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error updating location' });
    }
};

const deleteLocation = async (req, res) => {
    const { id } = req.params;

    try {
        const location = await Location.findByIdAndDelete(id);

        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (err) {
        console.error('Delete Location Error:', err.message);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid location ID format' });
        }
        res.status(500).json({ message: 'Server error deleting location' });
    }
};

const promotePartner = async (req, res) => {
    const { partnerId } = req.params;
    const { isFeatured = true } = req.body;

    try {
        const profile = await PartnerProfile.findOne({ user: partnerId });
        if (!profile) {
            return res.status(404).json({ message: 'Partner profile not found' });
        }

        profile.isFeatured = isFeatured;
        const updatedProfile = await profile.save();

        const action = isFeatured ? 'promoted' : 'demoted';
        res.status(200).json({ message: `Partner successfully ${action}`, profile: updatedProfile });
    } catch (err) {
        console.error('Promote Partner Error:', err.message);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid partner ID format' });
        }
        res.status(500).json({ message: 'Server error promoting partner' });
    }
};



module.exports = {
    getPendingVerification,
    verifyPartner,
    getAdminStats,
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    createLocation,
    getLocations,
    updateLocation,
    deleteLocation,
    promotePartner };