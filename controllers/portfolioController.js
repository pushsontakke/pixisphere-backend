const PartnerProfile = require('../models/PartnerProfile');
const User = require('../models/User');

const findOrCreateProfile = async (partnerId) => {
    let profile = await PartnerProfile.findOne({ user: partnerId });
    if (!profile) {
        profile = new PartnerProfile({ user: partnerId, portfolio: [] });
        await profile.save();
        await User.findByIdAndUpdate(partnerId, { partnerProfile: profile._id });
    }
    return profile;
};

const addPortfolioItem = async (req, res) => {
    const { imageUrl, description } = req.body;
    const partnerId = req.user.id;

    if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
    }

    try {
        let profile = await findOrCreateProfile(partnerId);
        const maxOrderIndexItem = profile.portfolio.reduce((max, item) =>
            item.orderIndex > (max ? max.orderIndex : -1) ? item : max, null);
        const nextOrderIndex = maxOrderIndexItem ? maxOrderIndexItem.orderIndex + 1 : 0;
        const newItem = {
            imageUrl: imageUrl.trim(),
            description: description ? description.trim() : '',
            orderIndex: nextOrderIndex,
            uploadedAt: Date.now(),
        };

        profile.portfolio.push(newItem);
        const updatedProfile = await profile.save();

        const addedItem = updatedProfile.portfolio.find(
            item => item._id.toString() === newItem._id.toString()
        );

        res.status(201).json({
            message: 'Portfolio item added successfully',
            item: addedItem,
        });
    } catch (err) {
        console.error('Add Portfolio Item Error:', err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error adding portfolio item' });
    }
};

const editPortfolioItem = async (req, res) => {
    const { itemId } = req.params;
    const { description } = req.body;
    const partnerId = req.user.id;

    if (!description && !req.body.imageUrl) { // Allow updating either
        return res.status(400).json({ message: 'Description or Image URL is required for update' });
    }

    try {
        const profile = await PartnerProfile.findOne({ user: partnerId });
        if (!profile) {
            return res.status(404).json({ message: 'Partner profile not found' });
        }

        const itemIndex = profile.portfolio.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }

        if (description !== undefined) {
            profile.portfolio[itemIndex].description = description.trim();
        }
        if (req.body.imageUrl !== undefined) {
            profile.portfolio[itemIndex].imageUrl = req.body.imageUrl.trim();
        }

        const updatedProfile = await profile.save();

        const updatedItem = updatedProfile.portfolio.find(item => item._id.toString() === itemId);

        res.status(200).json({
            message: 'Portfolio item updated successfully',
            item: updatedItem,
        });
    } catch (err) {
        console.error('Edit Portfolio Item Error:', err.message);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid portfolio item ID format' });
        }
        res.status(500).json({ message: 'Server error updating portfolio item' });
    }
};

const deletePortfolioItem = async (req, res) => {
    const { itemId } = req.params;
    const partnerId = req.user.id;

    try {
        const profile = await PartnerProfile.findOne({ user: partnerId });
        if (!profile) {
            return res.status(404).json({ message: 'Partner profile not found' });
        }

        const itemIndex = profile.portfolio.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }
        profile.portfolio.splice(itemIndex, 1);

        await profile.save();

        res.status(200).json({
            message: 'Portfolio item deleted successfully',
        });
    } catch (err) {
        console.error('Delete Portfolio Item Error:', err.message);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid portfolio item ID format' });
        }
        res.status(500).json({ message: 'Server error deleting portfolio item' });
    }
};

const reorderPortfolio = async (req, res) => {
    const { orderedItemIds } = req.body;
    const partnerId = req.user.id;

    if (!Array.isArray(orderedItemIds)) {
        return res.status(400).json({ message: 'orderedItemIds must be an array' });
    }

    try {
        const profile = await PartnerProfile.findOne({ user: partnerId });
        if (!profile) {
            return res.status(404).json({ message: 'Partner profile not found' });
        }
        const currentItemMap = {};
        profile.portfolio.forEach(item => {
            currentItemMap[item._id.toString()] = item;
        });

        for (const id of orderedItemIds) {
            if (!currentItemMap[id]) {
                return res.status(400).json({ message: `Invalid portfolio item ID provided: ${id}` });
            }
        }

        const reorderedPortfolio = orderedItemIds.map((id, index) => {
            const item = currentItemMap[id];
            item.orderIndex = index;
            return item;
        });

        profile.portfolio = reorderedPortfolio;

        const updatedProfile = await profile.save();

        res.status(200).json({
            message: 'Portfolio reordered successfully',
            portfolio: updatedProfile.portfolio,
        });
    } catch (err) {
        console.error('Reorder Portfolio Error:', err.message);
        res.status(500).json({ message: 'Server error reordering portfolio' });
    }
};

const getMyPortfolio = async (req, res) => {
    const partnerId = req.user.id;

    try {
        const profile = await PartnerProfile.findOne({ user: partnerId }).select('portfolio');
        if (!profile) {
            return res.status(404).json({ message: 'Partner profile not found' });
        }

        const sortedPortfolio = [...profile.portfolio].sort((a, b) => a.orderIndex - b.orderIndex);

        res.status(200).json({
            count: sortedPortfolio.length,
            portfolio: sortedPortfolio,
        });
    } catch (err) {
        console.error('Get Portfolio Error:', err.message);
        res.status(500).json({ message: 'Server error fetching portfolio' });
    }
};


module.exports = {
    addPortfolioItem,
    editPortfolioItem,
    deletePortfolioItem,
    reorderPortfolio,
    getMyPortfolio
};
