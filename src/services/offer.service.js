const Offer = require('../models/offer.model');

const getAllOffers = async (queryParams) => {
    const { search, offerOn, status } = queryParams;
    const query = {};
    const now = new Date();

    if (offerOn) {
        query.offerOn = { $in: offerOn.split(',') };
    }

    if (status) {
        const statuses = status.split(',');
        query.$or = [];
        if (statuses.includes('Upcoming')) {
            query.$or.push({ startDate: { $gt: now } });
        }
        if (statuses.includes('Ongoing')) {
            query.$or.push({ startDate: { $lte: now }, endDate: { $gte: now } });
        }
        if (statuses.includes('Expired')) {
            query.$or.push({ endDate: { $lt: now } });
        }
    }

    if (search) {
        query.$text = { $search: search };
    }

    const offers = await Offer.find(query);
    return offers;
};

const createOffer = async (offerData) => {
    if (offerData.discountPercentage) {
        offerData.discountType = 'PERCENTAGE';
        offerData.discountValue = offerData.discountPercentage;
    } else if (offerData.discountAmount) {
        offerData.discountType = 'FIXED_AMOUNT';
        offerData.discountValue = offerData.discountAmount;
    } else {
        throw new Error('Either discountPercentage or discountAmount must be provided.');
    }
    
    const offer = new Offer(offerData);
    await offer.save();
    return offer;
};

const getOfferById = async (id) => {
    const offer = await Offer.findById(id);
    if (!offer) {
        throw new Error('Offer not found.');
    }
    return offer;
};

const updateOffer = async (id, updateData) => {
    if (updateData.discountPercentage) {
        updateData.discountType = 'PERCENTAGE';
        updateData.discountValue = updateData.discountPercentage;
    } else if (updateData.discountAmount) {
        updateData.discountType = 'FIXED_AMOUNT';
        updateData.discountValue = updateData.discountAmount;
    }

    const offer = await Offer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!offer) {
        throw new Error('Offer not found.');
    }
    return offer;
};

const deleteOffer = async (id) => {
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) {
        throw new Error('Offer not found.');
    }
    return { message: 'Offer deleted successfully.' };
};


module.exports = {
    getAllOffers,
    createOffer,
    getOfferById,
    updateOffer,
    deleteOffer,
};
