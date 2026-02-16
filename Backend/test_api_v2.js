
// Mock fetch if not available (Node < 18)
const fetch = global.fetch || require('node-fetch');

const fetchLeetCodeStats = async (username) => {
    if (!username || !username.trim()) return null;
    try {
        console.log(`[LC] Fetching for: ${username}`);
        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                }
            }
        `;

        // Add timeout signal
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://leetcode.com/'
            },
            body: JSON.stringify({ query, variables: { username: username.trim() } }),
            signal: controller.signal
        });
        clearTimeout(timeout);

        console.log('[LC] Status:', response.status);
        if (!response.ok) {
            console.log('[LC] Error Body:', await response.text());
            return null;
        }

        const data = await response.json();
        console.log('[LC] Data:', JSON.stringify(data).substring(0, 100));
        return data.data?.matchedUser?.submitStats?.acSubmissionNum;
    } catch (error) {
        console.error("[LC] Error:", error.message);
        return null;
    }
};

const fetchCodeforcesStats = async (username) => {
    if (!username || !username.trim()) return null;
    try {
        console.log(`[CF] Fetching for: ${username}`);
        const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${username.trim()}`);
        const infoData = await infoRes.json();
        console.log('[CF] Status:', infoData.status);
        if (infoData.status !== 'OK') {
            console.log('[CF] Failed:', infoData.comment);
        }
        return infoData.result ? infoData.result[0] : null;
    } catch (error) {
        console.error("[CF] Error:", error.message);
        return null;
    }
};

const fetchGitHubStats = async (username) => {
    if (!username || !username.trim()) return null;
    try {
        console.log(`[GH] Fetching for: ${username}`);
        const res = await fetch(`https://api.github.com/users/${username.trim()}`);
        console.log('[GH] Status:', res.status);
        const data = await res.json();
        return data.public_repos;
    } catch (error) {
        console.error("[GH] Error:", error.message);
        return null;
    }
};

(async () => {
    console.log("--- STARTING ROBUST TESTS ---");

    // Test sequentially
    await fetchGitHubStats("facebook");
    await fetchCodeforcesStats("tourist");
    await fetchLeetCodeStats("shuvadup"); // Try a real user if known, or "leetcode" isn't a user usually. Let's try "tmwilliamlin168"

    console.log("--- END TESTS ---");
})();
