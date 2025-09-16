const express = require('express');
const bannerController = require('../controllers/banner.controller');
const upload = require('../middlewares/upload.middleware'); 

const router = express.Router();

router.route('/')
    .get(bannerController.getAllBanners)
    .post(upload.single('bannerImage'), bannerController.createBanner);

router.route('/:id')
    .put(upload.single('bannerImage'), bannerController.updateBanner)
    .delete(bannerController.deleteBanner);

module.exports = router;
