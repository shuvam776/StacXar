/**
 * MANDATORY SCORING FORMULAS
 */

const calculateLeetCodeScore = (stats) => {
    if (!stats) return { easy: 0, medium: 0, hard: 0, score: 0 };
    const { easy = 0, medium = 0, hard = 0 } = stats;

    // Formula: Easy * 1 + Medium * 3 + Hard * 7
    const rawScore = (easy * 1) + (medium * 3) + (hard * 7);

    // Normalized: log10(Score + 1) * 100
    const normalizedScore = Math.log10(rawScore + 1) * 100;

    return { easy, medium, hard, score: normalizedScore };
};

const calculateCodeforcesScore = (stats) => {
    if (!stats) return { rating: 0, solved: 0, score: 0 };
    const { rating = 0, solved = 0 } = stats;

    // Formula: max(0, (Rating - 800) * 1.2) + min(Solved * 0.3, 300)
    const ratingComponent = Math.max(0, (rating - 800) * 1.2);
    const solvedComponent = Math.min(solved * 0.3, 300);
    const score = ratingComponent + solvedComponent;

    return { rating, solved, score };
};

const validateGitHubRepo = (repo) => {
    // Strict Validation:
    // - Public (default if fetched from public API)
    // - Not a fork
    // - Has README
    // - >= 5 commits
    // - >= 2 files

    if (repo.fork) return false;
    if (!repo.has_readme) return false; // Note: need to check if API provides this or fetch separately
    if (repo.commits_count < 5) return false;
    if (repo.files_count < 2) return false;

    return true;
};

const calculateGitHubRepoScore = (repo) => {
    // Per-repo score:
    // (Commits >= 20 ? 3 : 1) + (Stars >= 5 ? 2 : 0) + (Issues or PRs ? 1 : 0)

    let score = (repo.commits_count >= 20 ? 3 : 1);
    score += (repo.stargazers_count >= 5 ? 2 : 0);
    score += (repo.has_issues || repo.pulls_count > 0 ? 1 : 0);

    return score;
};

const calculateGitHubScore = (repos) => {
    if (!repos || !Array.isArray(repos)) return { validRepos: 0, score: 0 };

    const validRepos = repos.filter(validateGitHubRepo);
    const totalRepoScore = validRepos.reduce((sum, repo) => sum + calculateGitHubRepoScore(repo), 0);

    // Normalized: log10(sum(RepoScore) + 1) * 100
    const normalizedScore = Math.log10(totalRepoScore + 1) * 100;

    return { validRepos: validRepos.length, score: normalizedScore };
};

const calculateFinalScore = (lcScore, cfScore, ghScore) => {
    // FinalRankScore = (0.45 * NormalizedLeetCode) + (0.35 * CodeforcesScore) + (0.20 * NormalizedGitHub)
    return (0.45 * lcScore) + (0.35 * cfScore) + (0.20 * ghScore);
};

module.exports = {
    calculateLeetCodeScore,
    calculateCodeforcesScore,
    calculateGitHubScore,
    calculateFinalScore,
    validateGitHubRepo // For use in fetchers if needed
};
