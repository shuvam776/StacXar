
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

        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://leetcode.com/'
            },
            body: JSON.stringify({ query, variables: { username: username.trim() } })
        });

        if (!response.ok) {
            console.log('[LC] Error Body:', await response.text());
            return null;
        }

        const data = await response.json();
        console.log('[LC] Full Response:', JSON.stringify(data));

        const stats = data.data?.matchedUser?.submitStats?.acSubmissionNum;
        if (stats) {
            console.log('[LC] Solved All:', stats.find(s => s.difficulty === 'All')?.count);
        } else {
            console.log('[LC] No stats found (User might not exist)');
        }
        return stats;
    } catch (error) {
        console.error("[LC] Error:", error.message);
        return null;
    }
};

(async () => {
    console.log("--- STARTING VALIDATION ---");
    // Explicitly test a known valid LeetCode user
    await fetchLeetCodeStats("tmwilliamlin168");
    console.log("--- END VALIDATION ---");
})();
