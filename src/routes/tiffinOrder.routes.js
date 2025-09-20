const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tiffinOrder.controller');
const auth = require('../middlewares/auth.middleware');

// create order (user)
router.post('/', auth, ctrl.create);

// get order by id
router.get('/:id', auth, ctrl.get);

// get my orders
router.get('/', auth, ctrl.myOrders);

// admin list / filter (protect with admin middleware if you have)
router.get('/admin/list/all', auth, ctrl.adminList);

// update status (admin/provider)
router.patch('/:id/status', auth, ctrl.updateStatus);

module.exports = router;