const express = require('express');
const couponController = require('../controllers/coupon.controller');
// const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router
    .route('/')
    .get(couponController.getAllCoupons)
    .post(couponController.createCoupon);

router
    .route('/:id')
    .get(couponController.getCouponById)
    .put(couponController.updateCoupon)
    .delete(couponController.deleteCoupon);

module.exports = router;

