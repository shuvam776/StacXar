const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: "Untitled Video"
    }
}, { timestamps: true });

exports.Video = mongoose.model("Video", videoSchema);
