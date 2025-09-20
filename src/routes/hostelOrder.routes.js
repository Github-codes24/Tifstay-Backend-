const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/hostelOrder.controller');
const auth = require('../middlewares/auth.middleware');

// create hostel booking
router.post('/', auth, ctrl.create);

// get booking by id
router.get('/:id', auth, ctrl.get);

// get my hostel bookings
router.get('/', auth, ctrl.myOrders);

// admin list
router.get('/admin/list/all', auth, ctrl.adminList);

// update status
router.patch('/:id/status', auth, ctrl.updateStatus);

module.exports = router;