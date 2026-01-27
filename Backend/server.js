require('dotenv').config();
const { app } = require('./app');
const connectDB = require('./config/db');

const { autoUpload } = require('./utils/autoUpload');

connectDB()
    .then(async () => {
        // Check for auto-uploads
        await autoUpload();

        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
