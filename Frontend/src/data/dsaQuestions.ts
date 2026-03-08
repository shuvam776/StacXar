export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ProgrammingLanguage = 'cpp' | 'java' | 'python' | 'javascript';

export interface Solution {
    language: ProgrammingLanguage;
    code: string;
}

export interface DSAQuestion {
    id: string;
    title: string;
    difficulty: Difficulty;
    leetcodeUrl?: string;
    gfgUrl?: string;
    leetcodeNumber?: number;   // Used by solutionFetcher to build GitHub URL
    leetcodeSlug?: string;     // The slug part of the LeetCode URL, e.g. "two-sum"
    solutions: Solution[];
}

export interface DSATopicData {
    id: string;
    title: string;
    description: string;
    questions: DSAQuestion[];
}

// Helper to generate boilerplate code
const generateBoilerplate = (title: string): Solution[] => [
    {
        language: 'cpp',
        code: `// C++ Solution for ${title}\n\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your code here\n    }\n};\n`
    },
    {
        language: 'java',
        code: `// Java Solution for ${title}\n\nclass Solution {\n    public void solve() {\n        // Write your code here\n    }\n}\n`
    },
    {
        language: 'python',
        code: `# Python Solution for ${title}\n\nclass Solution:\n    def solve(self):\n        # Write your code here\n        pass\n`
    },
    {
        language: 'javascript',
        code: `// JavaScript Solution for ${title}\n\n/**\n * @return {void}\n */\nvar solve = function() {\n    // Write your code here\n};\n`
    }
];

// Full Two Sum solution
const twoSumSolutions: Solution[] = [
    {
        language: 'cpp',
        code: `// C++ Solution for Two Sum\n\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> numMap;\n        for (int i = 0; i < (int)nums.size(); i++) {\n            int complement = target - nums[i];\n            if (numMap.count(complement))\n                return {numMap[complement], i};\n            numMap[nums[i]] = i;\n        }\n        return {};\n    }\n};\n`
    },
    {
        language: 'java',
        code: `// Java Solution for Two Sum\n\nimport java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> numMap = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (numMap.containsKey(complement))\n                return new int[]{numMap.get(complement), i};\n            numMap.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}\n`
    },
    {
        language: 'python',
        code: `# Python Solution for Two Sum\n\nclass Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        numMap = {}\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in numMap:\n                return [numMap[complement], i]\n            numMap[num] = i\n        return []\n`
    },
    {
        language: 'javascript',
        code: `// JavaScript Solution for Two Sum\n\nvar twoSum = function(nums, target) {\n    const numMap = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (numMap.has(complement))\n            return [numMap.get(complement), i];\n        numMap.set(nums[i], i);\n    }\n    return [];\n};\n`
    }
];

// --- LeetCode metadata for GitHub solution fetching ---
// Maps question ID → { number, slug } matching neetcode-gh/leetcode repo file naming
const LEETCODE_META: Record<string, { number: number; slug: string }> = {
    // Arrays
    'arr-1': { number: 1, slug: 'two-sum' },
    'arr-2': { number: 287, slug: 'find-the-duplicate-number' },
    'arr-3': { number: 26, slug: 'remove-duplicates-from-sorted-array' },
    'arr-4': { number: 121, slug: 'best-time-to-buy-and-sell-stock' },
    'arr-5': { number: 217, slug: 'contains-duplicate' },
    'arr-6': { number: 152, slug: 'maximum-product-subarray' },
    'arr-7': { number: 15, slug: '3sum' },
    'arr-8': { number: 11, slug: 'container-with-most-water' },
    'arr-9': { number: 238, slug: 'product-of-array-except-self' },
    'arr-10': { number: 560, slug: 'subarray-sum-equals-k' },
    'arr-11': { number: 54, slug: 'spiral-matrix' },
    'arr-12': { number: 48, slug: 'rotate-image' },
    'arr-13': { number: 55, slug: 'jump-game' },
    'arr-14': { number: 56, slug: 'merge-intervals' },
    'arr-15': { number: 73, slug: 'set-matrix-zeroes' },
    'arr-16': { number: 75, slug: 'sort-colors' },
    'arr-17': { number: 53, slug: 'maximum-subarray' },
    'arr-18': { number: 41, slug: 'first-missing-positive' },
    'arr-19': { number: 84, slug: 'largest-rectangle-in-histogram' },
    'arr-20': { number: 42, slug: 'trapping-rain-water' },
    // Strings
    'str-1': { number: 125, slug: 'valid-palindrome' },
    'str-2': { number: 242, slug: 'valid-anagram' },
    'str-3': { number: 14, slug: 'longest-common-prefix' },
    'str-4': { number: 151, slug: 'reverse-words-in-a-string' },
    'str-5': { number: 8, slug: 'string-to-integer-atoi' },
    'str-6': { number: 3, slug: 'longest-substring-without-repeating-characters' },
    'str-7': { number: 49, slug: 'group-anagrams' },
    'str-8': { number: 5, slug: 'longest-palindromic-substring' },
    'str-9': { number: 38, slug: 'count-and-say' },
    'str-10': { number: 6, slug: 'zigzag-conversion' },
    'str-11': { number: 17, slug: 'letter-combinations-of-a-phone-number' },
    'str-12': { number: 22, slug: 'generate-parentheses' },
    'str-13': { number: 79, slug: 'word-search' },
    'str-14': { number: 91, slug: 'decode-ways' },
    'str-15': { number: 76, slug: 'minimum-window-substring' },
    'str-16': { number: 10, slug: 'regular-expression-matching' },
    'str-17': { number: 44, slug: 'wildcard-matching' },
    'str-18': { number: 72, slug: 'edit-distance' },
    // Linked List
    'll-1': { number: 206, slug: 'reverse-linked-list' },
    'll-2': { number: 141, slug: 'linked-list-cycle' },
    'll-3': { number: 876, slug: 'middle-of-the-linked-list' },
    'll-4': { number: 21, slug: 'merge-two-sorted-lists' },
    'll-5': { number: 234, slug: 'palindrome-linked-list' },
    'll-6': { number: 19, slug: 'remove-nth-node-from-end-of-list' },
    'll-7': { number: 143, slug: 'reorder-list' },
    'll-8': { number: 2, slug: 'add-two-numbers' },
    'll-9': { number: 146, slug: 'lru-cache' },
    'll-10': { number: 138, slug: 'copy-list-with-random-pointer' },
    'll-11': { number: 148, slug: 'sort-list' },
    'll-12': { number: 160, slug: 'intersection-of-two-linked-lists' },
    'll-13': { number: 61, slug: 'rotate-list' },
    'll-14': { number: 142, slug: 'linked-list-cycle-ii' },
    'll-15': { number: 25, slug: 'reverse-nodes-in-k-group' },
    'll-16': { number: 23, slug: 'merge-k-sorted-lists' },
    // Stacks & Queues
    'sq-1': { number: 20, slug: 'valid-parentheses' },
    'sq-2': { number: 232, slug: 'implement-queue-using-stacks' },
    'sq-3': { number: 155, slug: 'min-stack' },
    'sq-4': { number: 225, slug: 'implement-stack-using-queues' },
    'sq-5': { number: 150, slug: 'evaluate-reverse-polish-notation' },
    'sq-6': { number: 739, slug: 'daily-temperatures' },
    'sq-7': { number: 901, slug: 'online-stock-span' },
    'sq-8': { number: 496, slug: 'next-greater-element-i' },
    'sq-9': { number: 503, slug: 'next-greater-element-ii' },
    'sq-10': { number: 239, slug: 'sliding-window-maximum' },
    'sq-11': { number: 84, slug: 'largest-rectangle-in-histogram' },
    'sq-12': { number: 224, slug: 'basic-calculator' },
    // Trees & BST
    'tree-1': { number: 226, slug: 'invert-binary-tree' },
    'tree-2': { number: 104, slug: 'maximum-depth-of-binary-tree' },
    'tree-3': { number: 101, slug: 'symmetric-tree' },
    'tree-4': { number: 100, slug: 'same-tree' },
    'tree-5': { number: 102, slug: 'binary-tree-level-order-traversal' },
    'tree-6': { number: 98, slug: 'validate-binary-search-tree' },
    'tree-7': { number: 235, slug: 'lowest-common-ancestor-of-a-binary-search-tree' },
    'tree-8': { number: 199, slug: 'binary-tree-right-side-view' },
    'tree-9': { number: 230, slug: 'kth-smallest-element-in-a-bst' },
    'tree-10': { number: 105, slug: 'construct-binary-tree-from-preorder-and-inorder-traversal' },
    'tree-11': { number: 112, slug: 'path-sum' },
    'tree-12': { number: 103, slug: 'binary-tree-zigzag-level-order-traversal' },
    'tree-13': { number: 124, slug: 'binary-tree-maximum-path-sum' },
    'tree-14': { number: 297, slug: 'serialize-and-deserialize-binary-tree' },
    // Dynamic Programming
    'dp-1': { number: 70, slug: 'climbing-stairs' },
    'dp-2': { number: 198, slug: 'house-robber' },
    'dp-3': { number: 322, slug: 'coin-change' },
    'dp-4': { number: 300, slug: 'longest-increasing-subsequence' },
    'dp-5': { number: 62, slug: 'unique-paths' },
    'dp-6': { number: 1143, slug: 'longest-common-subsequence' },
    'dp-7': { number: 45, slug: 'jump-game-ii' },
    'dp-8': { number: 416, slug: 'partition-equal-subset-sum' },
    'dp-9': { number: 139, slug: 'word-break' },
    'dp-10': { number: 1423, slug: 'maximum-points-you-can-obtain-from-cards' },
    'dp-11': { number: 312, slug: 'burst-balloons' },
    'dp-13': { number: 115, slug: 'distinct-subsequences' },
    // Graphs
    'gr-1': { number: 200, slug: 'number-of-islands' },
    'gr-2': { number: 133, slug: 'clone-graph' },
    'gr-3': { number: 417, slug: 'pacific-atlantic-water-flow' },
    'gr-4': { number: 207, slug: 'course-schedule' },
    'gr-5': { number: 210, slug: 'course-schedule-ii' },
    'gr-6': { number: 261, slug: 'graph-valid-tree' },
    'gr-7': { number: 286, slug: 'walls-and-gates' },
    'gr-8': { number: 994, slug: 'rotting-oranges' },
    'gr-9': { number: 127, slug: 'word-ladder' },
    'gr-10': { number: 743, slug: 'network-delay-time' },
    'gr-11': { number: 269, slug: 'alien-dictionary' },
};

/** Injects leetcodeNumber & leetcodeSlug from the lookup into a question object */
function withMeta<T extends { id: string }>(q: T): T & { leetcodeNumber?: number; leetcodeSlug?: string } {
    const meta = LEETCODE_META[q.id];
    if (!meta) return q;
    return { ...q, leetcodeNumber: meta.number, leetcodeSlug: meta.slug };
}

// --- The Data ---
export const dsaTrackerData: DSATopicData[] = [
    {
        id: 'arrays',
        title: 'Arrays',
        description: 'Fundamental linear data structure questions.',
        questions: [
            { id: 'arr-1', title: 'Two Sum', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', gfgUrl: 'https://www.geeksforgeeks.org/two-sum-problem/', solutions: twoSumSolutions },
            { id: 'arr-2', title: 'Find the Duplicate Number', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/find-the-duplicate-number/', solutions: generateBoilerplate('Find the Duplicate Number') },
            { id: 'arr-3', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', solutions: generateBoilerplate('Remove Duplicates from Sorted Array') },
            { id: 'arr-4', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', solutions: generateBoilerplate('Best Time to Buy and Sell Stock') },
            { id: 'arr-5', title: 'Contains Duplicate', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/', solutions: generateBoilerplate('Contains Duplicate') },
            { id: 'arr-6', title: 'Maximum Product Subarray', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/', solutions: generateBoilerplate('Maximum Product Subarray') },
            { id: 'arr-7', title: '3Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/3sum/', solutions: generateBoilerplate('3Sum') },
            { id: 'arr-8', title: 'Container With Most Water', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/', solutions: generateBoilerplate('Container With Most Water') },
            { id: 'arr-9', title: 'Product of Array Except Self', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/', solutions: generateBoilerplate('Product of Array Except Self') },
            { id: 'arr-10', title: 'Subarray Sum Equals K', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/', solutions: generateBoilerplate('Subarray Sum Equals K') },
            { id: 'arr-11', title: 'Spiral Matrix', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/', solutions: generateBoilerplate('Spiral Matrix') },
            { id: 'arr-12', title: 'Rotate Image', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/rotate-image/', solutions: generateBoilerplate('Rotate Image') },
            { id: 'arr-13', title: 'Jump Game', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/jump-game/', solutions: generateBoilerplate('Jump Game') },
            { id: 'arr-14', title: 'Merge Intervals', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/', solutions: generateBoilerplate('Merge Intervals') },
            { id: 'arr-15', title: 'Set Matrix Zeroes', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/', solutions: generateBoilerplate('Set Matrix Zeroes') },
            { id: 'arr-16', title: 'Sort Colors (Dutch Flag)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/sort-colors/', solutions: generateBoilerplate('Sort Colors (Dutch Flag)') },
            { id: 'arr-17', title: 'Maximum Subarray (Kadane)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', solutions: generateBoilerplate('Maximum Subarray (Kadane)') },
            { id: 'arr-18', title: 'First Missing Positive', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/first-missing-positive/', solutions: generateBoilerplate('First Missing Positive') },
            { id: 'arr-19', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', solutions: generateBoilerplate('Largest Rectangle in Histogram') },
            { id: 'arr-20', title: 'Trapping Rain Water', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/', solutions: generateBoilerplate('Trapping Rain Water') }
        ]
    },
    {
        id: 'strings',
        title: 'Strings',
        description: 'Character manipulation and matching algorithms.',
        questions: [
            { id: 'str-1', title: 'Valid Palindrome', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/', solutions: generateBoilerplate('Valid Palindrome') },
            { id: 'str-2', title: 'Valid Anagram', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/', solutions: generateBoilerplate('Valid Anagram') },
            { id: 'str-3', title: 'Longest Common Prefix', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/longest-common-prefix/', solutions: generateBoilerplate('Longest Common Prefix') },
            { id: 'str-4', title: 'Reverse Words in a String', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/reverse-words-in-a-string/', solutions: generateBoilerplate('Reverse Words in a String') },
            { id: 'str-5', title: 'String to Integer (atoi)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/string-to-integer-atoi/', solutions: generateBoilerplate('String to Integer (atoi)') },
            { id: 'str-6', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', solutions: generateBoilerplate('Longest Substring Without Repeating Characters') },
            { id: 'str-7', title: 'Group Anagrams', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/', solutions: generateBoilerplate('Group Anagrams') },
            { id: 'str-8', title: 'Longest Palindromic Substring', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/', solutions: generateBoilerplate('Longest Palindromic Substring') },
            { id: 'str-9', title: 'Count and Say', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/count-and-say/', solutions: generateBoilerplate('Count and Say') },
            { id: 'str-10', title: 'Zigzag Conversion', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/zigzag-conversion/', solutions: generateBoilerplate('Zigzag Conversion') },
            { id: 'str-11', title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', solutions: generateBoilerplate('Letter Combinations of a Phone Number') },
            { id: 'str-12', title: 'Generate Parentheses', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/', solutions: generateBoilerplate('Generate Parentheses') },
            { id: 'str-13', title: 'Word Search', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/word-search/', solutions: generateBoilerplate('Word Search') },
            { id: 'str-14', title: 'Decode Ways', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/decode-ways/', solutions: generateBoilerplate('Decode Ways') },
            { id: 'str-15', title: 'Minimum Window Substring', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/', solutions: generateBoilerplate('Minimum Window Substring') },
            { id: 'str-16', title: 'Regular Expression Matching', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/', solutions: generateBoilerplate('Regular Expression Matching') },
            { id: 'str-17', title: 'Wildcard Matching', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/wildcard-matching/', solutions: generateBoilerplate('Wildcard Matching') },
            { id: 'str-18', title: 'Edit Distance', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/edit-distance/', solutions: generateBoilerplate('Edit Distance') }
        ]
    },
    {
        id: 'linked-list',
        title: 'Linked List',
        description: 'Pointer-based dynamic combinations of nodes.',
        questions: [
            { id: 'll-1', title: 'Reverse Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/', solutions: generateBoilerplate('Reverse Linked List') },
            { id: 'll-2', title: 'Linked List Cycle', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/', solutions: generateBoilerplate('Linked List Cycle') },
            { id: 'll-3', title: 'Middle of the Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/', solutions: generateBoilerplate('Middle of the Linked List') },
            { id: 'll-4', title: 'Merge Two Sorted Lists', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', solutions: generateBoilerplate('Merge Two Sorted Lists') },
            { id: 'll-5', title: 'Palindrome Linked List', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/palindrome-linked-list/', solutions: generateBoilerplate('Palindrome Linked List') },
            { id: 'll-6', title: 'Remove Nth Node From End of List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', solutions: generateBoilerplate('Remove Nth Node From End of List') },
            { id: 'll-7', title: 'Reorder List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/reorder-list/', solutions: generateBoilerplate('Reorder List') },
            { id: 'll-8', title: 'Add Two Numbers', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/', solutions: generateBoilerplate('Add Two Numbers') },
            { id: 'll-9', title: 'LRU Cache', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/lru-cache/', solutions: generateBoilerplate('LRU Cache') },
            { id: 'll-10', title: 'Copy List With Random Pointer', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/', solutions: generateBoilerplate('Copy List With Random Pointer') },
            { id: 'll-11', title: 'Sort List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/sort-list/', solutions: generateBoilerplate('Sort List') },
            { id: 'll-12', title: 'Intersection of Two Linked Lists', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', solutions: generateBoilerplate('Intersection of Two Linked Lists') },
            { id: 'll-13', title: 'Rotate List', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/rotate-list/', solutions: generateBoilerplate('Rotate List') },
            { id: 'll-14', title: 'Linked List Cycle II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle-ii/', solutions: generateBoilerplate('Linked List Cycle II') },
            { id: 'll-15', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', solutions: generateBoilerplate('Reverse Nodes in k-Group') },
            { id: 'll-16', title: 'Merge K Sorted Lists', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', solutions: generateBoilerplate('Merge K Sorted Lists') }
        ]
    },
    {
        id: 'stacks-queues',
        title: 'Stacks & Queues',
        description: 'LIFO and FIFO data structure applications.',
        questions: [
            { id: 'sq-1', title: 'Valid Parentheses', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/', solutions: generateBoilerplate('Valid Parentheses') },
            { id: 'sq-2', title: 'Implement Queue using Stacks', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/', solutions: generateBoilerplate('Implement Queue using Stacks') },
            { id: 'sq-3', title: 'Min Stack', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/min-stack/', solutions: generateBoilerplate('Min Stack') },
            { id: 'sq-4', title: 'Implement Stack using Queues', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/implement-stack-using-queues/', solutions: generateBoilerplate('Implement Stack using Queues') },
            { id: 'sq-5', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', solutions: generateBoilerplate('Evaluate Reverse Polish Notation') },
            { id: 'sq-6', title: 'Daily Temperatures', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/', solutions: generateBoilerplate('Daily Temperatures') },
            { id: 'sq-7', title: 'Online Stock Span', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/online-stock-span/', solutions: generateBoilerplate('Online Stock Span') },
            { id: 'sq-8', title: 'Next Greater Element I', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/next-greater-element-i/', solutions: generateBoilerplate('Next Greater Element I') },
            { id: 'sq-9', title: 'Next Greater Element II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/next-greater-element-ii/', solutions: generateBoilerplate('Next Greater Element II') },
            { id: 'sq-10', title: 'Sliding Window Maximum', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/', solutions: generateBoilerplate('Sliding Window Maximum') },
            { id: 'sq-11', title: 'Largest Rectangle in Histogram (Stack)', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', solutions: generateBoilerplate('Largest Rectangle in Histogram (Stack)') },
            { id: 'sq-12', title: 'Basic Calculator', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/basic-calculator/', solutions: generateBoilerplate('Basic Calculator') }
        ]
    },
    {
        id: 'trees',
        title: 'Trees & BST',
        description: 'Hierarchical data structures with recursive patterns.',
        questions: [
            { id: 'tree-1', title: 'Invert Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/', solutions: generateBoilerplate('Invert Binary Tree') },
            { id: 'tree-2', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', solutions: generateBoilerplate('Maximum Depth of Binary Tree') },
            { id: 'tree-3', title: 'Symmetric Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/symmetric-tree/', solutions: generateBoilerplate('Symmetric Tree') },
            { id: 'tree-4', title: 'Same Tree', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/same-tree/', solutions: generateBoilerplate('Same Tree') },
            { id: 'tree-5', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', solutions: generateBoilerplate('Binary Tree Level Order Traversal') },
            { id: 'tree-6', title: 'Validate Binary Search Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/', solutions: generateBoilerplate('Validate Binary Search Tree') },
            { id: 'tree-7', title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', solutions: generateBoilerplate('Lowest Common Ancestor of BST') },
            { id: 'tree-8', title: 'Binary Tree Right Side View', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/', solutions: generateBoilerplate('Binary Tree Right Side View') },
            { id: 'tree-9', title: 'Kth Smallest Element in BST', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', solutions: generateBoilerplate('Kth Smallest Element in BST') },
            { id: 'tree-10', title: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', solutions: generateBoilerplate('Construct Binary Tree from Preorder and Inorder') },
            { id: 'tree-11', title: 'Path Sum', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/path-sum/', solutions: generateBoilerplate('Path Sum') },
            { id: 'tree-12', title: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', solutions: generateBoilerplate('Binary Tree Zigzag Level Order Traversal') },
            { id: 'tree-13', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', solutions: generateBoilerplate('Binary Tree Maximum Path Sum') },
            { id: 'tree-14', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', solutions: generateBoilerplate('Serialize and Deserialize Binary Tree') }
        ]
    },
    {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        description: 'Optimal substructure and overlapping subproblems.',
        questions: [
            { id: 'dp-1', title: 'Climbing Stairs', difficulty: 'Easy', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/', solutions: generateBoilerplate('Climbing Stairs') },
            { id: 'dp-2', title: 'House Robber', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/house-robber/', solutions: generateBoilerplate('House Robber') },
            { id: 'dp-3', title: 'Coin Change', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/coin-change/', solutions: generateBoilerplate('Coin Change') },
            { id: 'dp-4', title: 'Longest Increasing Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/', solutions: generateBoilerplate('Longest Increasing Subsequence') },
            { id: 'dp-5', title: 'Unique Paths', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/unique-paths/', solutions: generateBoilerplate('Unique Paths') },
            { id: 'dp-6', title: 'Longest Common Subsequence', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/', solutions: generateBoilerplate('Longest Common Subsequence') },
            { id: 'dp-7', title: 'Jump Game II', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/', solutions: generateBoilerplate('Jump Game II') },
            { id: 'dp-8', title: 'Partition Equal Subset Sum', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/', solutions: generateBoilerplate('Partition Equal Subset Sum') },
            { id: 'dp-9', title: 'Word Break', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/word-break/', solutions: generateBoilerplate('Word Break') },
            { id: 'dp-10', title: 'Maximum Points You Can Obtain from Cards', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/', solutions: generateBoilerplate('Maximum Points You Can Obtain from Cards') },
            { id: 'dp-11', title: 'Burst Balloons', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/burst-balloons/', solutions: generateBoilerplate('Burst Balloons') },
            { id: 'dp-12', title: '0/1 Knapsack', difficulty: 'Hard', leetcodeUrl: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/', solutions: generateBoilerplate('0/1 Knapsack') },
            { id: 'dp-13', title: 'Distinct Subsequences', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/distinct-subsequences/', solutions: generateBoilerplate('Distinct Subsequences') }
        ]
    },
    {
        id: 'graphs',
        title: 'Graphs & BFS/DFS',
        description: 'Traversal and connectivity problems on graphs.',
        questions: [
            { id: 'gr-1', title: 'Number of Islands', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/', solutions: generateBoilerplate('Number of Islands') },
            { id: 'gr-2', title: 'Clone Graph', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/', solutions: generateBoilerplate('Clone Graph') },
            { id: 'gr-3', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', solutions: generateBoilerplate('Pacific Atlantic Water Flow') },
            { id: 'gr-4', title: 'Course Schedule', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/', solutions: generateBoilerplate('Course Schedule') },
            { id: 'gr-5', title: 'Course Schedule II (Topological Sort)', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/', solutions: generateBoilerplate('Course Schedule II') },
            { id: 'gr-6', title: 'Graph Valid Tree', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/graph-valid-tree/', solutions: generateBoilerplate('Graph Valid Tree') },
            { id: 'gr-7', title: 'Walls and Gates', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/walls-and-gates/', solutions: generateBoilerplate('Walls and Gates') },
            { id: 'gr-8', title: 'Rotting Oranges', difficulty: 'Medium', leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/', solutions: generateBoilerplate('Rotting Oranges') },
            { id: 'gr-9', title: 'Word Ladder', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/word-ladder/', solutions: generateBoilerplate('Word Ladder') },
            { id: 'gr-10', title: "Dijkstra's Shortest Path", difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/', solutions: generateBoilerplate("Dijkstra's Shortest Path") },
            { id: 'gr-11', title: 'Alien Dictionary', difficulty: 'Hard', leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/', solutions: generateBoilerplate('Alien Dictionary') }
        ]
    }
];

// Post-process: inject leetcodeNumber and leetcodeSlug into every question
dsaTrackerData.forEach(topic => {
    topic.questions = topic.questions.map(q => withMeta(q)) as DSAQuestion[];
});
