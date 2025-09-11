const couponService = require('../services/coupon.service');
const { ok, created } = require('../utils/response');

const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await couponService.getAllCoupons(req.query);
        return ok(res, { message: 'Coupons retrieved successfully.', data: coupons });
    } catch (error) {
        next(error);
    }
};

const createCoupon = async (req, res, next) => {
    try {
        const coupon = await couponService.createCoupon(req.body);
        return created(res, { message: 'Coupon created successfully.', data: coupon });
    } catch (error) {
        next(error);
    }
};

const getCouponById = async (req, res, next) => {
    try {
        const coupon = await couponService.getCouponById(req.params.id);
        return ok(res, { message: 'Coupon details retrieved successfully.', data: coupon });
    } catch (error) {
        next(error);
    }
};

const updateCoupon = async (req, res, next) => {
    try {
        const coupon = await couponService.updateCoupon(req.params.id, req.body);
        return ok(res, { message: 'Coupon updated successfully.', data: coupon });
    } catch (error) {
        next(error);
    }
};

const deleteCoupon = async (req, res, next) => {
    try {
        const result = await couponService.deleteCoupon(req.params.id);
        return ok(res, { message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCoupons,
    createCoupon,
    getCouponById,
    updateCoupon,
    deleteCoupon,
};

