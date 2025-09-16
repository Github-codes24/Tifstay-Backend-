const Banner = require('../models/banner.model');
const fs = require('fs');
const path = require('path');

const getAllBanners = async (queryParams) => {
    const { search, status, startDate, endDate } = queryParams;
    const query = {};

    // Handle search by banner name (bannerType)
    if (search) {
        query.bannerType = { $regex: search, $options: 'i' };
    }

    // Handle status filter
    if (status) {
        if (status === 'Published') query.isPublished = true;
        if (status === 'Not Published') query.isPublished = false;
        // 'All' is the default
    }

    // Handle date range filter on the creation date
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const banners = await Banner.find(query).sort({ createdAt: -1 });
    return banners;
};

const createBanner = async (bannerData, file) => {
    if (!file) {
        throw new Error('Banner image is required.');
    }
    // The path to the image is provided by the upload middleware
    const imageUrl = file.path;
    const newBanner = new Banner({ ...bannerData, imageUrl });
    await newBanner.save();
    return newBanner;
};

const updateBanner = async (id, updateData, file) => {
    const banner = await Banner.findById(id);
    if (!banner) {
        throw new Error('Banner not found.');
    }

    // If a new image is uploaded, update the imageUrl and delete the old one
    if (file) {
        if (banner.imageUrl) {
            fs.unlink(path.resolve(banner.imageUrl), (err) => {
                if (err) console.error("Error deleting old banner image:", err);
            });
        }
        updateData.imageUrl = file.path;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    return updatedBanner;
};

const deleteBanner = async (id) => {
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
        throw new Error('Banner not found.');
    }
    // Delete the associated image file from the server
    if (banner.imageUrl) {
         fs.unlink(path.resolve(banner.imageUrl), (err) => {
            if (err) console.error("Error deleting banner image:", err);
        });
    }
    return { message: 'Banner deleted successfully.' };
};

module.exports = {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner,
};
