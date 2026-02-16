
const fetch = require('node-fetch'); // Ensure fetch is available if node < 18, but commonly available in new node. 
// Actually current backend uses native fetch likely if node 18+, but let's assume global fetch or require it. 
// The checking script will use the same environment.

const fetchLeetCodeStats = async (username) => {
    if (!username || !username.trim()) return null;
    try {
        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                    profile {
                        ranking
                    }
                }
            }
        `;

        console.log(`Fetching LeetCode for: ${username}`);
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            body: JSON.stringify({ query, variables: { username: username.trim() } })
        });

        console.log('LeetCode Status:', response.status);
        if (!response.ok) {
            console.log('LeetCode Error Body:', await response.text());
            return null;
        }

        const data = await response.json();
        console.log('LeetCode Data:', JSON.stringify(data).substring(0, 200) + '...');
        return data.data?.matchedUser?.submitStats?.acSubmissionNum;
    } catch (error) {
        console.error("LeetCode Fetch Error:", error.message);
        return null;
    }
};

const fetchCodeforcesStats = async (username) => {
    if (!username || !username.trim()) return null;
    try {
        console.log(`Fetching Codeforces for: ${username}`);
        const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${username.trim()}`);
        const infoData = await infoRes.json();
        console.log('Codeforces Info:', infoData.status);

        return infoData.result ? infoData.result[0] : null;
    } catch (error) {
        console.error("Codeforces Fetch Error:", error.message);
        return null;
    }
};

const fetchGitHubStats = async (username) => {
    if (!username || !username.trim()) return null;
    try {
        console.log(`Fetching GitHub for: ${username}`);
        const res = await fetch(`https://api.github.com/users/${username.trim()}`);
        console.log('GitHub Status:', res.status);
        const data = await res.json();
        return data.public_repos;
    } catch (error) {
        console.error("GitHub Fetch Error:", error.message);
        return null;
    }
};

(async () => {
    console.log("--- STARTING TESTS ---");
    await fetchLeetCodeStats("shuvadup"); // User's likely username or a common one
    await fetchCodeforcesStats("tourist");
    await fetchGitHubStats("facebook");
    console.log("--- END TESTS ---");
})();
