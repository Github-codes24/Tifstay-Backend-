const discountService = require('../services/discount.service');
const { ok, created } = require('../utils/response');

const getAllDiscounts = async (req, res, next) => {
    try {
        const discounts = await discountService.getAllDiscounts(req.query);
        return ok(res, { message: 'Discounts retrieved successfully.', data: discounts });
    } catch (error) {
        next(error);
    }
};

const createDiscount = async (req, res, next) => {
    try {
        const discount = await discountService.createDiscount(req.body);
        return created(res, { message: 'Discount created successfully.', data: discount });
    } catch (error) {
        next(error);
    }
};

const getDiscountById = async (req, res, next) => {
    try {
        const discount = await discountService.getDiscountById(req.params.id);
        return ok(res, { message: 'Discount details retrieved successfully.', data: discount });
    } catch (error) {
        next(error);
    }
};

const updateDiscount = async (req, res, next) => {
    try {
        const discount = await discountService.updateDiscount(req.params.id, req.body);
        return ok(res, { message: 'Discount updated successfully.', data: discount });
    } catch (error) {
        next(error);
    }
};

const deleteDiscount = async (req, res, next) => {
    try {
        const result = await discountService.deleteDiscount(req.params.id);
        return ok(res, { message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllDiscounts,
    createDiscount,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
};
