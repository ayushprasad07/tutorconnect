const express = require('express');
const { upload } = require('../middleware/multer.middleware.js');
const { uploadOnCloud } = require('../utils/cloudinary.js');
const fs = require('fs');

const router = express.Router();

router.post('/', upload.single("file"), async (req, res) => {
    try {
        const localFilePath = req.file.path;
        const result = await uploadOnCloud(localFilePath);

        fs.unlinkSync(localFilePath);

        if (!result) {
            return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
        }

        return res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

module.exports = router;
