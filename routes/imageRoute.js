const express = require('express');
const {uploadImage, getImages, deleteImage} = require('../controllers/ImageController');
const auth = require('../middleware/auth');
const router = express.Router();
const uplodMiddleware = require('../middleware/uploadImage');

router.post('/upload', auth, uplodMiddleware.single("image"), uploadImage);

router.get('/get-images', auth, getImages);
router.delete('/delete-image/:id', auth, deleteImage);

module.exports = router