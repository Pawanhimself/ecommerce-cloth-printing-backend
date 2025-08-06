const router = require("express").Router();
const {getCloudinaryStickers} = require("../controllers/cloudinaryController");

// Route to get stickers from Cloudinary
router.get('/stickers', getCloudinaryStickers);

module.exports = {
    cloudinaryRoutes: router
};