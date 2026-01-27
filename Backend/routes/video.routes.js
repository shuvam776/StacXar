const { Router } = require("express");
const { uploadVideo, getAllVideos } = require("../controllers/video.controller");
const { upload } = require("../middlewares/multer.middleware");

const router = Router();

router.route("/upload").post(
    upload.single("video"),
    uploadVideo
);

router.route("/").get(getAllVideos);

module.exports = router;
