const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
});

const checkFile = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error("Not Image"));
    }
}

module.exports = multer({
    storage,
    fileFilter: checkFile,
    limits: {
        fileSize: 5 * 1024 * 1025 // 5MB
    }
})