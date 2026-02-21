const User = require('../models/user.model');
const UserRank = require('../models/userRank.model');
const rankService = require('../services/rank.service');

// --- Controllers ---

exports.getDSAStats = async (req, res) => {
    try {
        const email = req.user?.email || req.headers['user-email'];
        if (!email) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Internal DSA Progress
        const dsaMap = user.roadmaps?.dsa ? Object.fromEntries(user.roadmaps.dsa.subtopics) : {};
        const dsaMastered = Object.values(dsaMap).filter(st => st.mastery === 3).length;
        const dsaTotalActive = Object.keys(dsaMap).length;

        // External Stats & Ranking
        const [leetcode, codeforces, rankData] = await Promise.all([
            rankService.fetchLeetCodeStats(user.leetcodeUsername),
            rankService.fetchCodeforcesStats(user.codeforcesUsername),
            UserRank.findOne({ userId: user._id })
        ]);

        const totalUsers = await UserRank.countDocuments();

        // Trigger background recompute if needed
        if (!rankData || (Date.now() - new Date(rankData.updatedAt).getTime() > 1000 * 60 * 60)) {
            rankService.recomputeUserRank(user).catch(err => console.error("BG Rank Recompute Error:", err));
        }

        // Projection Logic
        const totalSolved = (leetcode?.solved || 0) + (codeforces?.solved || 0);
        const monthsToInterview = Math.max(1, 6 - Math.floor(totalSolved / 100) - Math.floor(dsaMastered / 5));

        return res.status(200).json({
            user: {
                leetcodeUsername: user.leetcodeUsername,
                codeforcesUsername: user.codeforcesUsername
            },
            stats: {
                leetcode,
                codeforces
            },
            ranking: rankData ? {
                rank: rankData.rankPosition,
                totalUsers,
                tier: rankData.tier,
                score: rankData.finalScore,
                breakdown: {
                    dsa: rankData.leetcode.score,
                    cp: rankData.codeforces.score,
                    github: rankData.github.score
                }
            } : null,
            internal: {
                mastered: dsaMastered,
                totalActive: dsaTotalActive,
                projection: {
                    monthsToInterview,
                    readiness: totalSolved > 300 ? 'Interview-Capable' : 'Foundations'
                }
            }
        });

    } catch (error) {
        console.error("DSA Stats Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getWebDevStats = async (req, res) => {
    try {
        const email = req.user?.email || req.headers['user-email'];
        if (!email) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Internal Web Dev Progress
        const webDevMap = user.roadmaps?.webdev ? Object.fromEntries(user.roadmaps.webdev.subtopics) : {};
        const webDevMastered = Object.values(webDevMap).filter(st => st.mastery === 3).length;
        const webDevTotalActive = Object.keys(webDevMap).length;

        // GitHub / Projects
        const github = await rankService.fetchGitHubStats(user.githubUsername);
        const deployedProjects = user.deployedProjects || [];

        // Ranking Data
        const rankData = await UserRank.findOne({ userId: user._id });
        const totalUsers = await UserRank.countDocuments();

        // Projection Logic
        let readiness = "Beginner Builder";
        if (webDevMastered > 5 && deployedProjects.length > 1) readiness = "Product-Capable";
        if (webDevMastered > 12 && deployedProjects.length > 3) readiness = "Startup-Ready";

        return res.status(200).json({
            user: {
                githubUsername: user.githubUsername,
                githubAvatarUrl: user.githubAvatarUrl,
                linkedinUrl: user.linkedinUrl
            },
            stats: {
                github,
                deployedProjectsCount: deployedProjects.length,
                deployedProjectsList: deployedProjects
            },
            ranking: rankData ? {
                rank: rankData.rankPosition,
                totalUsers,
                tier: rankData.tier,
                score: rankData.finalScore,
                breakdown: {
                    dsa: rankData.leetcode.score,
                    cp: rankData.codeforces.score,
                    github: rankData.github.score
                }
            } : null,
            internal: {
                mastered: webDevMastered,
                totalActive: webDevTotalActive,
                projection: {
                    readiness,
                    nextMilestone: readiness === "Beginner Builder" ? "Build a Portfolio Site" : "Full Stack SaaS"
                }
            }
        });

    } catch (error) {
        console.error("Web Dev Stats Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getAppDevStats = async (req, res) => {
    try {
        const email = req.user?.email || req.headers['user-email'];
        if (!email) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Internal App Dev Progress
        const appDevMap = user.roadmaps?.appdev ? Object.fromEntries(user.roadmaps.appdev.subtopics) : {};
        const appDevMastered = Object.values(appDevMap).filter(st => st.mastery === 3).length;
        const appDevTotalActive = Object.keys(appDevMap).length;

        // Ranking Data
        const rankData = await UserRank.findOne({ userId: user._id });
        const totalUsers = await UserRank.countDocuments();

        // Projection Logic
        let readiness = "Mobile Learner";
        if (appDevMastered > 3) readiness = "Feature-Capable";
        if (appDevMastered > 8) readiness = "App-Ready";

        return res.status(200).json({
            user: {
                githubUsername: user.githubUsername,
                linkedinUrl: user.linkedinUrl
            },
            ranking: rankData ? {
                rank: rankData.rankPosition,
                totalUsers,
                tier: rankData.tier,
                score: rankData.finalScore
            } : null,
            internal: {
                mastered: appDevMastered,
                totalActive: appDevTotalActive,
                projection: {
                    readiness,
                    nextMilestone: readiness === "Mobile Learner" ? "Build a Weather App" : "Publish to Play Store"
                }
            }
        });

    } catch (error) {
        console.error("App Dev Stats Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Deprecated
exports.getDashboardStats = async (req, res) => {
    return res.status(410).json({ message: "Endpoint deprecated. Use /dsa, /webdev, or /appdev" });
};
