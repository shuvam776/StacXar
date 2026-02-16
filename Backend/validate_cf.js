
// Mock fetch if not available (Node < 18)
const fetch = global.fetch || require('node-fetch');

const fetchCodeforcesStats = async (username) => {
    if (!username || !username.trim()) return null;
    try {
        console.log(`[CF] Fetching for: ${username}`);
        // Fetch User Info first to see if user exists
        const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${username.trim()}`);
        const infoData = await infoRes.json();

        if (infoData.status !== 'OK') {
            console.log('[CF] User Info Failed:', infoData.comment);
            return null;
        }

        console.log('[CF] User Found. Fetching submissions...');

        // Fetch User Status to count Solved
        // Try a larger count to see performance
        const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${username.trim()}&from=1&count=5000`);
        const statusData = await statusRes.json();

        console.log('[CF] Status Res:', statusData.status);

        if (statusData.status === 'OK') {
            const uniqueProblems = new Set();
            statusData.result.forEach(sub => {
                if (sub.verdict === 'OK') {
                    uniqueProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
                }
            });
            console.log('[CF] Unique Solved (recent 5000):', uniqueProblems.size);
            return uniqueProblems.size;
        } else {
            console.log('[CF] Status Failed:', statusData.comment);
        }
        return 0;
    } catch (error) {
        console.error("[CF] Error:", error.message);
        return null;
    }
};

(async () => {
    // Test a known user, e.g. "Petr" or someone active but not tourist level
    await fetchCodeforcesStats("Petr");
})();
