/**
 * SolutionFetcher Service
 * Fetches real LeetCode solutions from the neetcode-gh/leetcode GitHub repo.
 * Falls back to a clean boilerplate if no solution exists.
 *
 * Repo structure:
 *   https://raw.githubusercontent.com/neetcode-gh/leetcode/main/{lang}/{number}-{slug}.{ext}
 */

export type ProgrammingLanguage = 'cpp' | 'java' | 'python' | 'javascript';

const GITHUB_BASE = 'https://raw.githubusercontent.com/neetcode-gh/leetcode/main';

const LANG_CONFIG: Record<ProgrammingLanguage, { folder: string; ext: string }> = {
    cpp: { folder: 'cpp', ext: 'cpp' },
    java: { folder: 'java', ext: 'java' },
    python: { folder: 'python', ext: 'py' },
    javascript: { folder: 'javascript', ext: 'js' },
};

const BOILERPLATE: Record<ProgrammingLanguage, (title: string) => string> = {
    cpp: (t) =>
        `// C++ Solution for ${t}\n\n#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n\n};\n`,
    java: (t) =>
        `// Java Solution for ${t}\n\nclass Solution {\n    // Write your solution here\n\n}\n`,
    python: (t) =>
        `# Python Solution for ${t}\n\nclass Solution:\n    def solve(self):\n        # Write your solution here\n        pass\n`,
    javascript: (t) =>
        `// JavaScript Solution for ${t}\n\nvar solve = function() {\n    // Write your solution here\n};\n`,
};

// In-memory cache: key = `questionId:lang`
const cache = new Map<string, string>();

/**
 * Formats a LeetCode problem number into 4-digit padded form, e.g. 1 → "0001"
 */
function pad(n: number): string {
    return String(n).padStart(4, '0');
}

/**
 * Fetches one language's solution from GitHub.
 * Returns null on any network / 404 error.
 */
async function fetchFromGitHub(
    number: number,
    slug: string,
    lang: ProgrammingLanguage
): Promise<string | null> {
    const cacheKey = `${number}:${lang}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    const { folder, ext } = LANG_CONFIG[lang];
    const url = `${GITHUB_BASE}/${folder}/${pad(number)}-${slug}.${ext}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const code = await res.text();
        cache.set(cacheKey, code);
        return code;
    } catch {
        return null;
    }
}

export interface FetchedSolution {
    language: ProgrammingLanguage;
    code: string;
    fromGitHub: boolean;
}

/**
 * Fetches solutions for all 4 languages for a given LeetCode question.
 * Falls back to boilerplate for languages where GitHub has no file.
 */
export async function fetchSolutions(
    questionTitle: string,
    leetcodeNumber: number,
    leetcodeSlug: string
): Promise<FetchedSolution[]> {
    const langs: ProgrammingLanguage[] = ['cpp', 'java', 'python', 'javascript'];

    const results = await Promise.all(
        langs.map(async (lang) => {
            const code = await fetchFromGitHub(leetcodeNumber, leetcodeSlug, lang);
            return {
                language: lang,
                code: code ?? BOILERPLATE[lang](questionTitle),
                fromGitHub: code !== null,
            };
        })
    );

    return results;
}
