const Coupon = require('../models/coupon.model');
// // You would typically have a more robust error handler
// const ApiError = require('../utils/ApiError'); 
// const httpStatus = require('http-status');

/**
 * Get all coupons with filtering, searching
 * @param {object} queryParams - Query parameters from the request
 * @returns {Promise<QueryResult>}
 */
const getAllCoupons = async (queryParams) => {
    const { search, offerOn, status } = queryParams;
    let query = {};
    const now = new Date();

    if (search) {
        query.couponCode = { $regex: search, $options: 'i' };
    }

    if (offerOn) {
        const offerTypes = offerOn.split(',');
        query.offerOn = { $in: offerTypes };
    }
    
    // The dynamic 'status' is a virtual field, so we can't query it directly.
    // We must build the date logic to filter by status.
    if (status) {
        const statuses = status.split(',');
        const statusQueries = [];
        if (statuses.includes('Upcoming')) {
            statusQueries.push({ startDate: { $gt: now } });
        }
        if (statuses.includes('Ongoing')) {
            statusQueries.push({ startDate: { $lte: now }, endDate: { $gte: now } });
        }
        if (statuses.includes('Expired')) {
            statusQueries.push({ endDate: { $lt: now } });
        }
        if (statusQueries.length > 0) {
            query.$or = statusQueries;
        }
    }
    
    // .lean() is a performance optimization for read-only operations
    const coupons = await Coupon.find(query).sort({ createdAt: -1 }).lean();
    return coupons;
};

/**
 * Create a new coupon
 * @param {object} couponBody
 * @returns {Promise<Coupon>}
 */
const createCoupon = async (couponBody) => {
    if (await Coupon.findOne({ couponCode: couponBody.couponCode })) {
        throw new Error('A coupon with this code already exists.');
    }

    const { discountAmount, discountPercentage, ...restOfBody } = couponBody;
    const processedBody = { ...restOfBody };

    if (discountPercentage) {
        processedBody.discountType = 'PERCENTAGE';
        processedBody.discountValue = discountPercentage;
    } else if (discountAmount) {
        processedBody.discountType = 'FIXED_AMOUNT';
        processedBody.discountValue = discountAmount;
    } else {
        throw new Error('You must provide either a discountAmount or a discountPercentage.');
    }

    return Coupon.create(processedBody);
};

/**
 * Get coupon details by ID
 * @param {string} id
 * @returns {Promise<Coupon>}
 */
const getCouponById = async (id) => {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        throw new Error('Coupon not found.');
    }
    // If the coupon applies to specific providers, populate their details.
    // This is needed for the "Coupon Details" page.
    if (coupon.appliesTo.scope === 'PARTICULAR') {
        await coupon.populate({
            path: 'appliesTo.ids',
            model: coupon.offerOnModel, // Use the dynamic model name
            select: 'name' // Assuming your Hostel/Tiffin models have a 'name' field
        });
    }
    return coupon;
};

/**
 * Update a coupon by ID
 * @param {string} id
 * @param {object} updateBody
 * @returns {Promise<Coupon>}
 */
const updateCoupon = async (id, updateBody) => {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        throw new Error('Coupon not found.');
    }

    // Handle discount type switching if frontend sends new values
    const { discountAmount, discountPercentage, ...restOfBody } = updateBody;
    const processedBody = { ...restOfBody };
    if (discountPercentage) {
        processedBody.discountType = 'PERCENTAGE';
        processedBody.discountValue = discountPercentage;
    } else if (discountAmount) {
        processedBody.discountType = 'FIXED_AMOUNT';
        processedBody.discountValue = discountAmount;
    }

    Object.assign(coupon, processedBody);
    await coupon.save();
    return coupon;
};

/**
 * Delete a coupon by ID
 * @param {string} id
 * @returns {Promise<Coupon>}
 */
const deleteCoupon = async (id) => {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        throw new Error('Coupon not found.');
    }
    await coupon.deleteOne(); // Use deleteOne on the document
    return { message: 'Coupon deleted successfully.' };
};

module.exports = {
    getAllCoupons,
    createCoupon,
    getCouponById,
    updateCoupon,
    deleteCoupon,
};

