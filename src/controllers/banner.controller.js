const bannerService = require('../services/banner.service');
const { ok, created } = require('../utils/response');

const getAllBanners = async (req, res, next) => {
    try {
        const banners = await bannerService.getAllBanners(req.query);
        return ok(res, { message: 'Banners retrieved successfully.', data: banners });
    } catch (error) {
        next(error);
    }
};

const createBanner = async (req, res, next) => {
    try {
        const banner = await bannerService.createBanner(req.body, req.file);
        return created(res, { message: 'Banner created successfully.', data: banner });
    } catch (error) {
        next(error);
    }
};

const updateBanner = async (req, res, next) => {
    try {
        const banner = await bannerService.updateBanner(req.params.id, req.body, req.file);
        return ok(res, { message: 'Banner updated successfully.', data: banner });
    } catch (error) {
        next(error);
    }
};

const deleteBanner = async (req, res, next) => {
    try {
        const result = await bannerService.deleteBanner(req.params.id);
        return ok(res, { message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner,
};
