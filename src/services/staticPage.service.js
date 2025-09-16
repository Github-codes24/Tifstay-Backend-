const StaticPage = require('../models/staticPage.model');

const getAllStaticPages = async (queryParams) => {
    const { search, status, startDate, endDate } = queryParams;
    const query = {};

    // Handle search by page title
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    // Handle status filter
    if (status) {
        if (status === 'Published') query.isPublished = true;
        if (status === 'Not Published') query.isPublished = false;
    }

    // Handle date range filter on the creation date
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const pages = await StaticPage.find(query).sort({ updatedAt: -1 });
    return pages;
};

const createStaticPage = async (pageData) => {
    const newPage = new StaticPage(pageData);
    await newPage.save();
    return newPage;
};

const getStaticPageById = async (id) => {
    const page = await StaticPage.findById(id);
    if (!page) {
        throw new Error('Static page not found.');
    }
    return page;
};

const updateStaticPage = async (id, updateData) => {
    const updatedPage = await StaticPage.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPage) {
        throw new Error('Static page not found.');
    }
    return updatedPage;
};

const deleteStaticPage = async (id) => {
    const page = await StaticPage.findByIdAndDelete(id);
    if (!page) {
        throw new Error('Static page not found.');
    }
    return { message: 'Static page deleted successfully.' };
};

module.exports = {
    getAllStaticPages,
    createStaticPage,
    getStaticPageById,
    updateStaticPage,
    deleteStaticPage,
};
