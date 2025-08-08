const cloudinary = require('../config/cloudinary');

const cloudinaryUpload = async (filePath) => {
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(filePath);
        console.log(['uploadResult', uploadResult.public_id]);

        return {
            publicId: uploadResult.public_id,
            url: uploadResult.secure_url
        }
    } catch (error) {
        throw new Error('Error ' + error);
    }
}

module.exports = {cloudinaryUpload}