
import type { Topic } from "./dsaData";

export const webDevTopics: Topic[] = [
    {
        id: 'phase-1',
        title: 'Phase 1: Foundations',
        description: 'Building blocks of the web: HTML, CSS, JS.',
        subtopics: [
            {
                id: 'html-basics',
                title: 'HTML Basics',
                description: 'Semantic markup and document structure.',
                resources: [
                    { id: 'res-html-mdn', title: 'MDN: HTML Basics', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' },
                    { id: 'res-html-vid', title: 'HTML Refresher', type: 'video', url: 'https://www.youtube.com/watch?v=kUMe1FH4CHE' }
                ]
            },
            {
                id: 'css-fundamentals',
                title: 'CSS Fundamentals',
                description: 'Styling, Box Model, and Flexbox.',
                resources: [
                    { id: 'res-css-mdn', title: 'MDN: CSS First Steps', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps' },
                    { id: 'res-css-grid', title: 'CSS Grid Guide', type: 'article', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' }
                ]
            },
            {
                id: 'js-essentials',
                title: 'JavaScript Essentials',
                description: 'Variables, loops, functions, and ES6+.',
                resources: [
                    { id: 'res-js-info', title: 'The Modern JS Tutorial', type: 'article', url: 'https://javascript.info/' },
                    { id: 'res-js-freecodecamp', title: 'JS Algorithms Course', type: 'video', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' }
                ]
            },
            {
                id: 'dom-manipulation',
                title: 'DOM Manipulation',
                description: 'Interacting with the browser document.',
                resources: [
                    { id: 'res-dom-mdn', title: 'Manipulating Documents', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents' }
                ]
            }
        ]
    },
    {
        id: 'phase-2',
        title: 'Phase 2: Modern Frontend',
        description: 'Component-based architecture with React.',
        subtopics: [
            {
                id: 'react-fundamentals',
                title: 'React Fundamentals',
                description: 'JSX, Components, and Props.',
                resources: [
                    { id: 'res-react-docs', title: 'React Official Docs', type: 'article', url: 'https://react.dev/learn' }
                ]
            },
            {
                id: 'state-effects',
                title: 'State & Effects',
                description: 'Hooks: useState, useEffect.',
                resources: [
                    { id: 'res-react-hooks', title: 'Understanding Hooks', type: 'article', url: 'https://react.dev/reference/react' }
                ]
            },
            {
                id: 'react-router',
                title: 'Navigation & Routing',
                description: 'Client-side routing with React Router.',
                resources: [
                    { id: 'res-router-docs', title: 'React Router Docs', type: 'article', url: 'https://reactrouter.com/en/main' }
                ]
            }
        ]
    },
    {
        id: 'phase-3',
        title: 'Phase 3: Backend Foundations',
        description: 'Server-side logic with Node.js.',
        subtopics: [
            {
                id: 'nodejs-basics',
                title: 'Node.js Basics',
                description: 'Runtime environment and modules.',
                resources: [
                    { id: 'res-node-docs', title: 'Node.js Introduction', type: 'article', url: 'https://nodejs.org/en/docs/guides/getting-started-guide/' }
                ]
            },
            {
                id: 'express-js',
                title: 'Express.js',
                description: 'Building REST APIs.',
                resources: [
                    { id: 'res-express-docs', title: 'Express Routing', type: 'article', url: 'https://expressjs.com/en/guide/routing.html' },
                    { id: 'res-rest-api', title: 'REST API Concepts', type: 'video', url: 'https://www.youtube.com/watch?v=-MTSQjw5DrM' }
                ]
            },
            {
                id: 'middleware',
                title: 'Middleware',
                description: 'Request processing pipeline.',
                resources: [
                    { id: 'res-express-mid', title: 'Using Middleware', type: 'article', url: 'https://expressjs.com/en/guide/using-middleware.html' }
                ]
            }
        ]
    },
    {
        id: 'phase-4',
        title: 'Phase 4: Database',
        description: 'Data persistence with MongoDB.',
        subtopics: [
            {
                id: 'mongodb-fundamentals',
                title: 'MongoDB Basics',
                description: 'NoSQL concepts and Documents.',
                resources: [
                    { id: 'res-mongo-uni', title: 'MongoDB University', type: 'article', url: 'https://learn.mongodb.com/' }
                ]
            },
            {
                id: 'schema-design',
                title: 'Schema Design',
                description: 'Modeling data relationships.',
                resources: [
                    { id: 'res-mongoose', title: 'Mongoose Docs', type: 'article', url: 'https://mongoosejs.com/docs/guide.html' }
                ]
            },
            {
                id: 'crud-ops',
                title: 'CRUD Operations',
                description: 'Create, Read, Update, Delete.',
                resources: [
                    { id: 'res-mongo-crud', title: 'MongoDB CRUD', type: 'article', url: 'https://www.mongodb.com/docs/manual/crud/' }
                ]
            }
        ]
    },
    {
        id: 'phase-5',
        title: 'Phase 5: Full Stack Apps',
        description: 'Integrating Frontend and Backend.',
        subtopics: [
            {
                id: 'api-integration',
                title: 'API Integration',
                description: 'Fetching data in React.',
                resources: [
                    { id: 'res-axios', title: 'Axios Docs', type: 'article', url: 'https://axios-http.com/docs/intro' }
                ]
            },
            {
                id: 'auth-flows',
                title: 'Authentication',
                description: 'JWT, Cookies, and Protected Routes.',
                resources: [
                    { id: 'res-jwt-intro', title: 'JWT Introduction', type: 'article', url: 'https://jwt.io/introduction' },
                    { id: 'res-auth-vid', title: 'MERN Auth Tutorial', type: 'video', url: 'https://www.youtube.com/watch?v=QAswbL1g5xU' }
                ]
            }
        ]
    },
    {
        id: 'phase-6',
        title: 'Phase 6: Deployment',
        description: 'Taking your app to production.',
        subtopics: [
            {
                id: 'deployment-concepts',
                title: 'Deployment Basics',
                description: 'Build processes and hosting.',
                resources: [
                    { id: 'res-vercel', title: 'Deploying to Vercel', type: 'article', url: 'https://vercel.com/docs/concepts/deployments/overview' }
                ]
            },
            {
                id: 'cicd-intro',
                title: 'CI/CD Intro',
                description: 'Continuous Integration/Deployment.',
                resources: [
                    { id: 'res-github-actions', title: 'GitHub Actions', type: 'article', url: 'https://docs.github.com/en/actions' }
                ]
            }
        ]
    }
];
