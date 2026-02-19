const User = require('../models/user.model');

exports.getRoadmapProgress = async (req, res) => {
    try {
        const email = req.user?.email || req.headers['user-email'];
        if (!email) return res.status(401).json({ message: "Unauthorized: No email provided" });

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`[Roadmap] New user ${email}: Initializing empty progress`);
            return res.status(200).json({});
        }
        return res.status(200).json(user.roadmaps || {});
    } catch (error) {
        console.error(`[Roadmap Error] Fetch failed for ${req.headers['user-email']}:`, error);
        return res.status(500).json({ message: error.message });
    }
};

exports.updateRoadmapProgress = async (req, res) => {
    try {
        const { roadmapType, subtopicId, data } = req.body;
        const email = req.user?.email || req.headers['user-email'];

        console.log(`[Roadmap Update] Saving for ${email}: ${roadmapType} -> ${subtopicId}`);

        if (!email) return res.status(401).json({ message: "Unauthorized: No email provided" });
        if (!roadmapType || !subtopicId || !data) {
            return res.status(400).json({ message: "Missing required fields: roadmapType, subtopicId, or data" });
        }

        const allowedTypes = ['dsa', 'webdev', 'appdev'];
        if (!allowedTypes.includes(roadmapType)) {
            return res.status(400).json({ message: `Invalid roadmapType: ${roadmapType}` });
        }

        const updateField = `roadmaps.${roadmapType}.subtopics.${subtopicId}`;

        console.log(`[Roadmap Update] Params: email=${email}, type=${roadmapType}, field=${updateField}`);
        console.log(`[Roadmap Update] Data:`, JSON.stringify(data));

        // Uses $set to update specific subtopic in the Map
        const user = await User.findOneAndUpdate(
            { email },
            {
                $set: { [updateField]: data },
                $setOnInsert: {
                    username: email.split('@')[0] || 'user_' + Date.now(),
                    fullName: 'New User',
                    password: 'firebase-auth-user',
                    avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                }
            },
            { new: true, upsert: true }
        ).catch(err => {
            console.error(`[Roadmap Update Error] MongoDB Failure:`, err);
            throw err;
        });

        console.log(`[Roadmap Update] Success for ${email}`);
        return res.status(200).json(user.roadmaps);
    } catch (error) {
        console.error(`[Roadmap Update Error] Catch Block:`, error.message);
        return res.status(500).json({ message: error.message });
    }
};
