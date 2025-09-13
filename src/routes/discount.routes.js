const express = require('express');
const discountController = require('../controllers/discount.controller');
const router = express.Router();

router.route('/')
    .get(discountController.getAllDiscounts)
    .post(discountController.createDiscount);

router.route('/:id')
    .get(discountController.getDiscountById)
    .put(discountController.updateDiscount)
    .delete(discountController.deleteDiscount);

module.exports = router;
