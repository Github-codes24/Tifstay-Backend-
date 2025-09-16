const staticPageService = require('../services/staticPage.service');
const { ok, created } = require('../utils/response');

const getAllStaticPages = async (req, res, next) => {
    try {
        const pages = await staticPageService.getAllStaticPages(req.query);
        return ok(res, { message: 'Static pages retrieved successfully.', data: pages });
    } catch (error) {
        next(error);
    }
};

const createStaticPage = async (req, res, next) => {
    try {
        const page = await staticPageService.createStaticPage(req.body);
        return created(res, { message: 'Static page created successfully.', data: page });
    } catch (error) {
        next(error);
    }
};

const getStaticPageById = async (req, res, next) => {
    try {
        const page = await staticPageService.getStaticPageById(req.params.id);
        return ok(res, { message: 'Static page retrieved successfully.', data: page });
    } catch (error) {
        next(error);
    }
};

const updateStaticPage = async (req, res, next) => {
    try {
        const page = await staticPageService.updateStaticPage(req.params.id, req.body);
        return ok(res, { message: 'Static page updated successfully.', data: page });
    } catch (error) {
        next(error);
    }
};

const deleteStaticPage = async (req, res, next) => {
    try {
        const result = await staticPageService.deleteStaticPage(req.params.id);
        return ok(res, { message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllStaticPages,
    createStaticPage,
    getStaticPageById,
    updateStaticPage,
    deleteStaticPage,
};
