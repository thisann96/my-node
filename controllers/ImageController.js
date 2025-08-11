const {cloudinaryUpload} = require('../helpers/cloudinaryUpload');
const Image = require('../models/ImageModel');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const asyncHandler = require('express-async-handler');
const {responseSuccess, responseFail} = require('../helpers/responseHelper');

const uploadImage = asyncHandler(async (req, res) => {

    const file = req.file;

    if (!file) responseFail(res, "File required", 400);

    const {publicId, url} = await cloudinaryUpload(file.path);

    const image = await Image.create({
        url,
        publicId,
        uploadedBy: req.userInfo.userId
    });

    if (image) responseSuccess(res, image, 'Uploaded successfully', 201);

    fs.unlinkSync(file.path);
});

const getImages = asyncHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'createAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images
    });

});

const deleteImage = asyncHandler(async (req, res) => {

    const imageID = req.params.id;
    const image = await Image.findById(imageID);

    if (!image) {
        res.status(404).json({
            success: false,
            message: "Image Not found",
        });
    }

    if (req.userInfo.userId !== image.uploadedBy.toString()) {
        res.status(403).json({
            success: false,
            message: "Not Authorized",
        });
    }

    await cloudinary.uploader.destroy(image.publicId);
    await Image.findByIdAndUpdate(imageID, {url: null});

    responseSuccess(res, '', 'Delete successfully', 200);

});

module.exports = {uploadImage, getImages, deleteImage}