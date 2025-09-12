const express = require('express');
const offerController = require('../controllers/offer.controller');
const router = express.Router();

router.route('/')
    .get(offerController.getAllOffers)
    .post(offerController.createOffer);

router.route('/:id')
    .get(offerController.getOfferById)
    .put(offerController.updateOffer)
    .delete(offerController.deleteOffer);

module.exports = router;
