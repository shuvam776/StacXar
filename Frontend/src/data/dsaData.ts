export type ResourceType = 'video' | 'article' | 'leetcode' | 'codeforces' | 'project';

export interface Resource {
    id: string;
    title: string;
    type: ResourceType;
    url: string;
}

export interface SubTopic {
    id: string;
    title: string;
    description: string;
    resources: Resource[];
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    subtopics: SubTopic[];
}

export const dsaTopics: Topic[] = [
    {
        id: 'level-0',
        title: 'Level 0: Foundations',
        description: 'Programming & Complexity Foundations.',
        subtopics: [
            {
                id: 'big-o',
                title: 'Big-O Notation',
                description: 'Analysis of Algorithms Big-O Analysis.',
                resources: [
                    { id: 'r0-1', title: 'Reference Documentation', type: 'article', url: 'https://www.geeksforgeeks.org/analysis-of-algorithms-big-o-analysis/' }
                ]
            },
            {
                id: 'complexity',
                title: 'Time & Space Complexity',
                description: 'Advanced complexity analysis concepts.',
                resources: [
                    { id: 'r0-2', title: 'CP Algorithms Guide', type: 'article', url: 'https://cp-algorithms.com/' }
                ]
            }
        ]
    },
    {
        id: 'level-1',
        title: 'Level 1: Basic Data Structures',
        description: 'Linear structures: Arrays, Strings, Lists, Stacks, Queues.',
        subtopics: [
            {
                id: 'arr-1',
                title: 'Array Data Structure',
                description: 'Fundamentals of array manipulation.',
                resources: [
                    { id: 'r1-1', title: 'Arrays Reference', type: 'article', url: 'https://www.geeksforgeeks.org/array-data-structure/' }
                ]
            },
            {
                id: 'arr-2',
                title: "Kadane's Algorithm",
                description: "Maximum subarray sum in O(n).",
                resources: [
                    { id: 'r1-kadane-vid', title: 'Kadane explanation', type: 'video', url: '#' },
                    { id: 'r1-kadane-lc', title: 'Maximum Subarray', type: 'leetcode', url: 'https://leetcode.com/problems/maximum-subarray/' }
                ]
            },
            {
                id: 'arr-3',
                title: 'Dutch National Flag Algo',
                description: "Sort array of 0s, 1s, and 2s.",
                resources: [
                    { id: 'r1-dutch-lc', title: 'Sort Colors', type: 'leetcode', url: 'https://leetcode.com/problems/sort-colors/' }
                ]
            },
            {
                id: 'sliding-window',
                title: 'Sliding Window',
                description: 'Technique for processing subarrays.',
                resources: [
                    { id: 'r1-2', title: 'Sliding Window Tutorial', type: 'article', url: 'https://www.geeksforgeeks.org/window-sliding-technique/' },
                    { id: 'r1-sw-vid', title: 'Sliding Window Video', type: 'video', url: '#' },
                    { id: 'r1-sw-lc', title: 'Longest Substring without Repeating Characters', type: 'leetcode', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' }
                ]
            },
            {
                id: 'prefix-sum',
                title: 'Prefix Sum',
                description: 'Precomputing sums for range queries.',
                resources: [
                    { id: 'r1-3', title: 'Prefix Sum Apps', type: 'article', url: 'https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/' }
                ]
            },
            {
                id: 'str-1',
                title: 'String Algorithms',
                description: 'Hashing and basic string processing.',
                resources: [
                    { id: 'r1-4', title: 'String Hashing', type: 'article', url: 'https://cp-algorithms.com/string/string-hashing.html' }
                ]
            },
            {
                id: 'kmp',
                title: 'KMP Algorithm',
                description: 'Pattern searching in linear time.',
                resources: [
                    { id: 'r1-5', title: 'KMP Explanation', type: 'article', url: 'https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/' }
                ]
            },
            {
                id: 'str-reverse',
                title: 'Reverse words in string',
                description: "String manipulation basics.",
                resources: [
                    { id: 'r1-str-lc', title: 'Reverse Words in a String', type: 'leetcode', url: 'https://leetcode.com/problems/reverse-words-in-a-string/' }
                ]
            },
            {
                id: 'str-palindrome',
                title: 'Longest Palindrome Substring',
                description: "Find longest symmetric substring.",
                resources: [
                    { id: 'r1-pal-lc', title: 'Longest Palindromic Substring', type: 'leetcode', url: 'https://leetcode.com/problems/longest-palindromic-substring/' }
                ]
            },
            {
                id: 'linked-list-basic',
                title: 'Linked List',
                description: 'Nodes, pointers, and dynamic lists.',
                resources: [
                    { id: 'r1-6', title: 'LL Basics', type: 'article', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/' }
                ]
            },
            {
                id: 'll-reverse',
                title: 'Reverse a Linked List',
                description: "Iterative and Recursive methods.",
                resources: [
                    { id: 'r1-ll-rev-lc', title: 'Reverse Linked List', type: 'leetcode', url: 'https://leetcode.com/problems/reverse-linked-list/' }
                ]
            },
            {
                id: 'll-cycle',
                title: 'Detect Cycle',
                description: "Floyd's Cycle-Finding Algorithm.",
                resources: [
                    { id: 'r1-ll-cy-lc', title: 'Linked List Cycle', type: 'leetcode', url: 'https://leetcode.com/problems/linked-list-cycle/' }
                ]
            },
            {
                id: 'stack-basic',
                title: 'Stack',
                description: 'LIFO data structure.',
                resources: [
                    { id: 'r1-7', title: 'Stack Reference', type: 'article', url: 'https://www.geeksforgeeks.org/stack-data-structure/' }
                ]
            },
            {
                id: 'queue-basic',
                title: 'Queue',
                description: 'FIFO data structure.',
                resources: [
                    { id: 'r1-8', title: 'Queue Reference', type: 'article', url: 'https://www.geeksforgeeks.org/queue-data-structure/' }
                ]
            }
        ]
    },
    {
        id: 'level-2',
        title: 'Level 2: Searching & Sorting',
        description: 'Organization and retrieval of data.',
        subtopics: [
            {
                id: 'binary-search',
                title: 'Binary Search',
                description: 'Efficient search in sorted arrays.',
                resources: [
                    { id: 'r2-1', title: 'Binary Search Guide', type: 'article', url: 'https://cp-algorithms.com/num_methods/binary_search.html' }
                ]
            },
            {
                id: 'sorting-overview',
                title: 'Sorting Overview',
                description: 'Comparing various sorting algorithms.',
                resources: [
                    { id: 'r2-2', title: 'Sorting Algorithms', type: 'article', url: 'https://www.geeksforgeeks.org/sorting-algorithms/' }
                ]
            }
        ]
    },
    {
        id: 'level-3',
        title: 'Level 3: Recursion & Backtracking',
        description: 'Problem solving via state exploration.',
        subtopics: [
            {
                id: 'recursion',
                title: 'Recursion',
                description: 'Function calling itself.',
                resources: [
                    { id: 'r3-1', title: 'Recursion Explained', type: 'article', url: 'https://www.geeksforgeeks.org/recursion/' }
                ]
            },
            {
                id: 'backtracking',
                title: 'Backtracking',
                description: 'Exhaustive search with pruning.',
                resources: [
                    { id: 'r3-2', title: 'Backtracking Guide', type: 'article', url: 'https://www.geeksforgeeks.org/backtracking-algorithms/' }
                ]
            }
        ]
    },
    {
        id: 'level-4',
        title: 'Level 4: Trees',
        description: 'Hierarchical nodes and branching.',
        subtopics: [
            {
                id: 'tree-traversals',
                title: 'Traversals',
                description: "Inorder, Preorder, Postorder.",
                resources: [
                    { id: 'r4-tr-lc', title: 'Binary Tree Inorder Traversal', type: 'leetcode', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' }
                ]
            },
            {
                id: 'tree-level-order',
                title: 'Level Order Traversal',
                description: "Breadth-First Search on trees.",
                resources: [
                    { id: 'r4-lo-lc', title: 'Binary Tree Level Order Traversal', type: 'leetcode', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' }
                ]
            },
            {
                id: 'binary-tree',
                title: 'Binary Tree',
                description: 'Binary structures and traversals.',
                resources: [
                    { id: 'r4-1', title: 'Binary Tree Reference', type: 'article', url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/' }
                ]
            },
            {
                id: 'trie',
                title: 'Trie',
                description: 'Prefix trees for string retrieval.',
                resources: [
                    { id: 'r4-2', title: 'Trie Insert/Search', type: 'article', url: 'https://www.geeksforgeeks.org/trie-insert-and-search/' }
                ]
            }
        ]
    },
    {
        id: 'level-5',
        title: 'Level 5: Heaps',
        description: 'Priority-based data retrieval.',
        subtopics: [
            {
                id: 'heap-basic',
                title: 'Heap Data Structure',
                description: 'Min-Heap and Max-Heap implementation.',
                resources: [
                    { id: 'r5-1', title: 'Heap Reference', type: 'article', url: 'https://www.geeksforgeeks.org/heap-data-structure/' }
                ]
            }
        ]
    },
    {
        id: 'level-6',
        title: 'Level 6: Greedy Algorithms',
        description: 'Local optimization for global solutions.',
        subtopics: [
            {
                id: 'greedy-intro',
                title: 'Greedy Algorithms',
                description: 'Introduction and common patterns.',
                resources: [
                    { id: 'r6-1', title: 'Greedy Intro', type: 'article', url: 'https://www.geeksforgeeks.org/greedy-algorithms/' }
                ]
            }
        ]
    },
    {
        id: 'level-7',
        title: 'Level 7: Graphs',
        description: 'Complex connectivity and relationships.',
        subtopics: [
            {
                id: 'graph-ds',
                title: 'Graph Data Structure',
                description: 'Adjacency list, matrix, and traversal.',
                resources: [
                    { id: 'r7-1', title: 'Graph Reference', type: 'article', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/' }
                ]
            },
            {
                id: 'graph-traversal',
                title: 'BFS & DFS',
                description: "Graph traversal algorithms.",
                resources: [
                    { id: 'r7-bfs-lc', title: 'Number of Islands', type: 'leetcode', url: 'https://leetcode.com/problems/number-of-islands/' }
                ]
            },
            {
                id: 'dijkstra',
                title: 'Dijkstra Algorithm',
                description: 'Single-source shortest path.',
                resources: [
                    { id: 'r7-2', title: 'Dijkstra Guide', type: 'article', url: 'https://cp-algorithms.com/graph/dijkstra.html' }
                ]
            }
        ]
    },
    {
        id: 'level-8',
        title: 'Level 8: Dynamic Programming',
        description: 'Optimal substructure and overalpping subproblems.',
        subtopics: [
            {
                id: 'dp-intro-new',
                title: 'DP Intro',
                description: 'Memoization and Tabulation.',
                resources: [
                    { id: 'r8-1', title: 'DP Reference', type: 'article', url: 'https://www.geeksforgeeks.org/dynamic-programming/' }
                ]
            },
            {
                id: 'dp-knapsack',
                title: '0/1 Knapsack',
                description: "Classic optimization problem.",
                resources: []
            },
            {
                id: 'dp-stairs',
                title: 'Climbing Stairs',
                description: "Basic DP introduction.",
                resources: [
                    { id: 'r8-stairs-lc', title: 'Climbing Stairs', type: 'leetcode', url: 'https://leetcode.com/problems/climbing-stairs/' }
                ]
            },
            {
                id: 'dp-patterns',
                title: 'DP Patterns',
                description: 'Recognizing common DP challenges.',
                resources: [
                    { id: 'r8-2', title: 'Leetcode DP Patterns', type: 'article', url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns' }
                ]
            }
        ]
    },
    {
        id: 'level-9',
        title: 'Level 9: Bit Manipulation',
        description: 'Low-level optimal computation.',
        subtopics: [
            {
                id: 'bit-manip',
                title: 'Bit Manipulation',
                description: 'Bitwise operations and tricks.',
                resources: [
                    { id: 'r9-1', title: 'Bitwise Guide', type: 'article', url: 'https://www.geeksforgeeks.org/bitwise-algorithms/' }
                ]
            }
        ]
    },
    {
        id: 'level-10',
        title: 'Level 10: Advanced Data Structures',
        description: 'Segment Trees and Disjoint Sets.',
        subtopics: [
            {
                id: 'segment-tree',
                title: 'Segment Tree',
                description: 'Range sum/min/max queries.',
                resources: [
                    { id: 'r10-1', title: 'Segment Tree Guide', type: 'article', url: 'https://cp-algorithms.com/data_structures/segment_tree.html' }
                ]
            },
            {
                id: 'dsu',
                title: 'Disjoint Set Union',
                description: 'Union-Find with optimization.',
                resources: [
                    { id: 'r10-2', title: 'DSU Guide', type: 'article', url: 'https://cp-algorithms.com/data_structures/disjoint_set_union.html' }
                ]
            }
        ]
    },
    {
        id: 'level-11',
        title: 'Level 11: Mathematical Algorithms',
        description: 'Prime numbers and number theory.',
        subtopics: [
            {
                id: 'sieve',
                title: 'Sieve of Eratosthenes',
                description: 'Finding primes efficiently.',
                resources: [
                    { id: 'r11-1', title: 'Sieve Guide', type: 'article', url: 'https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html' }
                ]
            }
        ]
    },
    {
        id: 'level-12',
        title: 'Level 12: Problem Solving Patterns',
        description: 'Advanced strategies and heuristics.',
        subtopics: [
            {
                id: 'two-pointer',
                title: 'Two Pointers',
                description: 'Optimization for linear search.',
                resources: [
                    { id: 'r12-1', title: 'Two Pointer Technique', type: 'article', url: 'https://www.geeksforgeeks.org/two-pointers-technique/' }
                ]
            },
            {
                id: 'monotonic-stack',
                title: 'Monotonic Stack',
                description: 'Nearest smaller/greater element.',
                resources: [
                    { id: 'r12-2', title: 'Monotonic Stack Intro', type: 'article', url: 'https://www.geeksforgeeks.org/introduction-to-monotonic-stack-2/' }
                ]
            }
        ]
    }
];
