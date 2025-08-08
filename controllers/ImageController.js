const {cloudinaryUpload} = require('../helpers/cloudinaryUpload');
const Image = require('../models/ImageModel');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            res.status(400).json({
                success: false,
                message: 'File required'
            });
        }

        const {publicId, url} = await cloudinaryUpload(file.path);

        const image = await Image.create({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        if (image) {
            res.status(201).json({
                success: true,
                message: 'Uploaded successfully',
                data: image
            });
        }

        fs.unlinkSync(file.path);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something Went wrong',
        });
    }

}

const getImages = async (req, res) => {
    try {
        console.log(req)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page -1) * limit;

        const sortBy = req.query.sortBy || 'createAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj={};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            currentPage:page,
            totalPages:totalPages,
            totalImages:totalImages,
            data: images
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }

}

const deleteImage = async (req, res) => {
    try {
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

        res.status(200).json({
            success: true,
            message: "Success",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }

}
module.exports = {uploadImage, getImages, deleteImage}