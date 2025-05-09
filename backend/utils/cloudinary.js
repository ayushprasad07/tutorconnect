const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloud = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File uploaded successfully to Cloudinary:", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the local file if upload fails
        return null;
    }
};

module.exports = { uploadOnCloud };
