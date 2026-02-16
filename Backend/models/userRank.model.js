const mongoose = require('mongoose');

const userRankSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    userEmail: { // Added for easier lookup if needed
        type: String,
        required: true,
        unique: true
    },
    leetcode: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
        score: { type: Number, default: 0 }
    },
    codeforces: {
        rating: { type: Number, default: 0 },
        solved: { type: Number, default: 0 },
        score: { type: Number, default: 0 }
    },
    github: {
        validRepos: { type: Number, default: 0 },
        score: { type: Number, default: 0 }
    },
    finalScore: {
        type: Number,
        default: 0,
        index: true
    },
    rankPosition: {
        type: Number,
        default: 0
    },
    tier: {
        type: String,
        default: 'Bronze'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Pre-save hook to determine tier based on finalScore
userRankSchema.pre('save', function (next) {
    const score = this.finalScore;
    if (score >= 400) this.tier = 'Legend';
    else if (score >= 300) this.tier = 'Grandmaster';
    else if (score >= 200) this.tier = 'Master';
    else if (score >= 100) this.tier = 'Diamond';
    else if (score >= 50) this.tier = 'Platinum';
    else if (score >= 25) this.tier = 'Gold';
    else if (score >= 10) this.tier = 'Silver';
    else this.tier = 'Bronze';
    next();
});

module.exports = mongoose.model("UserRank", userRankSchema);
