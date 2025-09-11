const express = require('express');
const couponController = require('../controllers/coupon.controller');
// const auth = require('../middlewares/auth.middleware');

const router = express.Router();

// Matches P1 (list) and P2 (create)
router
    .route('/')
    .get(couponController.getAllCoupons)
    .post(couponController.createCoupon);

// Matches P3 (details), P4 (edit), and delete action
router
    .route('/:id')
    .get(couponController.getCouponById)
    .put(couponController.updateCoupon)
    .delete(couponController.deleteCoupon);

module.exports = router;

