const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/post.controller');
const { auth } = require('../middlewares/auth.middleware');

router.get('/', ctrl.list);
// router.post('/', auth(), ctrl.create);
// router.get('/:id', ctrl.getOne);
// router.put('/:id', auth(), ctrl.update);
// router.delete('/:id', auth('admin'), ctrl.remove);

module.exports = router;
