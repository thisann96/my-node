const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINAY_NAME,
    api_key: process.env.CLOUDINAY_KEY,
    api_secret: process.env.CLOUDINAY_SECRET
});

module.exports = cloudinary;