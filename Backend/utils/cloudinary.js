const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.warn("[Cloudinary] No local file path provided.");
            return null;
        }

        if (!fs.existsSync(localFilePath)) {
            console.error(`[Cloudinary] Local file does not exist at path: ${localFilePath}`);
            return null;
        }

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "stacxar_profiles"
        })

        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("[Cloudinary] Upload Error:", error);
        if (error.message) console.error("[Cloudinary] Error Message:", error.message);

        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (unlinkError) {
                console.error("[Cloudinary] Failed to clean up file:", unlinkError.message);
            }
        }
        return null;
    }
}

module.exports = {
    uploadOnCloudinary
}
