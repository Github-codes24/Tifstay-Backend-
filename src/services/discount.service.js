const Discount = require('../models/discount.model');

const getAllDiscounts = async (queryParams) => {
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

    const discounts = await Discount.find(query);
    return discounts;
};

const createDiscount = async (discountData) => {
    if (discountData.discountPercentage) {
        discountData.discountType = 'PERCENTAGE';
        discountData.discountValue = discountData.discountPercentage;
    } else if (discountData.discountAmount) {
        discountData.discountType = 'FIXED_AMOUNT';
        discountData.discountValue = discountData.discountAmount;
    } else {
        throw new Error('Either discountPercentage or discountAmount must be provided.');
    }
    
    const discount = new Discount(discountData);
    await discount.save();
    return discount;
};

const getDiscountById = async (id) => {
    const discount = await Discount.findById(id);
    if (!discount) {
        throw new Error('Discount not found.');
    }
    return discount;
};

const updateDiscount = async (id, updateData) => {
    if (updateData.discountPercentage) {
        updateData.discountType = 'PERCENTAGE';
        updateData.discountValue = updateData.discountPercentage;
    } else if (updateData.discountAmount) {
        updateData.discountType = 'FIXED_AMOUNT';
        updateData.discountValue = updateData.discountAmount;
    }

    const discount = await Discount.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!discount) {
        throw new Error('Discount not found.');
    }
    return discount;
};

const deleteDiscount = async (id) => {
    const discount = await Discount.findByIdAndDelete(id);
    if (!discount) {
        throw new Error('Discount not found.');
    }
    return { message: 'Discount deleted successfully.' };
};


module.exports = {
    getAllDiscounts,
    createDiscount,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
};
