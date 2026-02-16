const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    leetcodeUsername: {
        type: String,
        trim: true,
        default: null
    },
    codeforcesUsername: {
        type: String,
        trim: true,
        default: null
    },
    codechefUsername: {
        type: String,
        trim: true,
        default: null
    },
    githubUsername: {
        type: String,
        trim: true,
        default: null
    },
    linkedinUrl: {
        type: String,
        trim: true,
        default: null
    },
    deployedProjects: [{
        title: String,
        url: String,
        description: String,
        dateAdded: { type: Date, default: Date.now }
    }],
    avatar: {
        type: String, // Cloudinary url
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    },
    roadmaps: {
        dsa: {
            subtopics: {
                type: Map,
                of: Object,
                default: {}
            }
        },
        webdev: {
            subtopics: {
                type: Map,
                of: Object,
                default: {}
            }
        },
        appdev: {
            subtopics: {
                type: Map,
                of: Object,
                default: {}
            }
        }
    }
}, { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
