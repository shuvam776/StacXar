const User = require('../models/user.model');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const { recomputeUserRank } = require('../services/rank.service');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const email = req.user?.email || req.headers['user-email'];
        if (!email) return res.status(401).json({ message: "Unauthorized: No email provided" });

        const user = await User.findOne({ email }).select('-password -__v');
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure default structure if any field is missing (for older users)
        const profile = {
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            leetcodeUsername: user.leetcodeUsername || null,
            codeforcesUsername: user.codeforcesUsername || null,
            codechefUsername: user.codechefUsername || null,
            githubUsername: user.githubUsername || null,
            linkedinUrl: user.linkedinUrl || null,
            deployedProjects: user.deployedProjects || []
        };

        return res.status(200).json(profile);
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const email = req.user?.email || req.headers['user-email'];
        if (!email) return res.status(401).json({ message: "Unauthorized: No email provided" });

        // Allowed fields to update
        const updateData = {};
        const allowedFields = [
            'fullName',
            'leetcodeUsername',
            'codeforcesUsername',
            'codechefUsername',
            'githubUsername',
            'linkedinUrl',
            'deployedProjects'
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'deployedProjects' && typeof req.body[field] === 'string') {
                    try {
                        updateData[field] = JSON.parse(req.body[field]);
                    } catch (e) {
                        console.error("Error parsing deployedProjects:", e);
                        updateData[field] = [];
                    }
                } else if (typeof req.body[field] === 'string') {
                    updateData[field] = req.body[field].trim();
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        // Handle Avatar Upload
        if (req.file) {
            const avatar = await uploadOnCloudinary(req.file.path);
            if (avatar) {
                updateData.avatar = avatar.url;
            }
        }

        const user = await User.findOneAndUpdate(
            { email },
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password -__v');

        if (!user) return res.status(404).json({ message: "User not found" });

        // Trigger Rank Recomputation if any social handle changed
        const socialHandles = ['leetcodeUsername', 'codeforcesUsername', 'githubUsername'];
        const changedSocial = socialHandles.some(field => req.body[field] !== undefined);

        if (changedSocial) {
            recomputeUserRank(user).catch(err => console.error("Profile update rank recompute error:", err));
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Profile Update Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
