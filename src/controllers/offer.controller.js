const offerService = require('../services/offer.service');
const { ok, created } = require('../utils/response');

const getAllOffers = async (req, res, next) => {
    try {
        const offers = await offerService.getAllOffers(req.query);
        return ok(res, { message: 'Offers retrieved successfully.', data: offers });
    } catch (error) {
        next(error);
    }
};

const createOffer = async (req, res, next) => {
    try {
        const offer = await offerService.createOffer(req.body);
        return created(res, { message: 'Offer created successfully.', data: offer });
    } catch (error) {
        next(error);
    }
};

const getOfferById = async (req, res, next) => {
    try {
        const offer = await offerService.getOfferById(req.params.id);
        return ok(res, { message: 'Offer details retrieved successfully.', data: offer });
    } catch (error) {
        next(error);
    }
};

const updateOffer = async (req, res, next) => {
    try {
        const offer = await offerService.updateOffer(req.params.id, req.body);
        return ok(res, { message: 'Offer updated successfully.', data: offer });
    } catch (error) {
        next(error);
    }
};

const deleteOffer = async (req, res, next) => {
    try {
        const result = await offerService.deleteOffer(req.params.id);
        return ok(res, { message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllOffers,
    createOffer,
    getOfferById,
    updateOffer,
    deleteOffer,
};
