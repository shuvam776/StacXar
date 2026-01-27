const { ApiResponse } = require("../utils/ApiResponse");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const cloudinary = require("../config/cloudinary"); // Import configured cloudinary instance
const { Video } = require("../models/video.model");

const uploadVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json(
            new ApiResponse(400, {}, "Video file is missing")
        );
    }

    const videoLocalPath = req.file.path;


    const video = await uploadOnCloudinary(videoLocalPath);

    if (!video) {
        return res.status(500).json(
            new ApiResponse(500, {}, "Failed to upload video to Cloudinary")
        );
    }
    const newVideo = await Video.create({
        url: video.url,
        public_id: video.public_id || "unknown",
        title: req.body.title || req.file.originalname
    });
    return res.status(200).json(
        new ApiResponse(200, {
            video: newVideo,
            url: video.url,
            is_video: true
        }, "Video uploaded and saved successfully")
    );
}

const getAllVideos = async (req, res) => {
    try {

        try {
           
            const result = await cloudinary.api.resources({
                resource_type: 'video',
                type: 'upload',
                max_results: 50 
            });

            if (result && result.resources) {
                const cloudVideos = result.resources;

                const operations = cloudVideos.map(async (vid) => {
                    const existing = await Video.findOne({ public_id: vid.public_id });
                    if (!existing) {
                        return Video.create({
                            public_id: vid.public_id,
                            url: vid.secure_url,
                            title: `Imported: ${vid.public_id}` // Default title
                        });
                    }
                    return null;
                });

                await Promise.all(operations);
            }
        } catch (cloudError) {
            console.error("Failed to sync with Cloudinary:", cloudError);
         }
        return res.status(200).json(
            new ApiResponse(200, videos, "Videos fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching videos:", error);
        return res.status(500).json(
            new ApiResponse(500, {}, "Failed to fetch videos")
        );
    }
}

module.exports = {
    uploadVideo,
    getAllVideos
}
