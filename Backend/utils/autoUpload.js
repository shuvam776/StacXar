const fs = require('fs');
const path = require('path');
const { uploadOnCloudinary } = require('./cloudinary');

const autoUpload = async () => {
    const publicDir = path.join(__dirname, '../public');
    const uploadedDir = path.join(publicDir, 'uploaded');

    // Create uploaded directory if it doesn't exist
    if (!fs.existsSync(uploadedDir)) {
        fs.mkdirSync(uploadedDir, { recursive: true });
    }

    // Read files in public directory
    const files = fs.readdirSync(publicDir);

    // Filter for video files (e.g., mp4) and exclude directories
    const videoFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp4', '.mov', '.avi'].includes(ext) && fs.statSync(path.join(publicDir, file)).isFile();
    });

    if (videoFiles.length === 0) {
        console.log("No new videos found in public/ to auto-upload.");
        return;
    }

    console.log(`Found ${videoFiles.length} video(s) to upload...`);

    for (const file of videoFiles) {
        const sourcePath = path.join(publicDir, file);

        // We need to copy to a temp file because uploadOnCloudinary deletes the source
        // But here we want to move it to 'uploaded' folder after, so we can let it delete the temp copy
        // and we handle the source file movement.

        // Actually, uploadOnCloudinary takes a localFilePath and unlinks it.
        // So we should copy source -> temp, upload temp (it gets deleted), then move source -> uploaded.

        const tempDir = path.join(publicDir, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempPath = path.join(tempDir, file);
        fs.copyFileSync(sourcePath, tempPath);

        console.log(`Uploading ${file}...`);
        const result = await uploadOnCloudinary(tempPath);

        if (result) {
            console.log(`✅ Uploaded ${file}: ${result.url}`);

            // Move original file to uploaded folder
            const destPath = path.join(uploadedDir, file);
            fs.renameSync(sourcePath, destPath);
            console.log(`Moved ${file} to public/uploaded/`);
        } else {
            console.error(`❌ Failed to upload ${file}`);
            // Clean up temp file if uploadOnCloudinary didn't (it usually does on catch)
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }
};

module.exports = { autoUpload };
