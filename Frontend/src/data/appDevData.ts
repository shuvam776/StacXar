
import type { Topic } from "./dsaData";

export interface AppDevTrack {
    id: 'android' | 'react-native';
    title: string;
    description: string;
    topics: Topic[];
}

export const androidTrack: AppDevTrack = {
    id: 'android',
    title: 'Android Native (Kotlin)',
    description: 'Master Android Development with Kotlin and Jetpack Compose.',
    topics: [
        {
            id: 'android-foundations',
            title: 'Foundations & Tooling',
            description: 'Kotlin and Android Studio setup.',
            subtopics: [
                {
                    id: 'kotlin-basics',
                    title: 'Kotlin Fundamentals',
                    description: 'Basic syntax, null safety, and functional features.',
                    resources: [
                        { id: 'kt-docs', title: 'Official Kotlin Docs', type: 'article', url: 'https://kotlinlang.org/docs/home.html' },
                        { id: 'kt-fcc', title: 'Kotlin for Beginners', type: 'video', url: 'https://www.youtube.com/watch?v=F9UC9DY-vIU' }
                    ]
                },
                {
                    id: 'android-studio',
                    title: 'Android Studio Setup',
                    description: 'Configuring IDE and Emulator.',
                    resources: [
                        { id: 'as-docs', title: 'Android Studio Guide', type: 'article', url: 'https://developer.android.com/studio/intro' }
                    ]
                }
            ]
        },
        {
            id: 'android-ui',
            title: 'Modern UI: Jetpack Compose',
            description: 'Declarative UI for modern Android apps.',
            subtopics: [
                {
                    id: 'compose-basics',
                    title: 'Jetpack Compose Basics',
                    description: 'Composables, State, and Layouts.',
                    resources: [
                        { id: 'compose-docs', title: 'Compose Documentation', type: 'article', url: 'https://developer.android.com/jetpack/compose' },
                        { id: 'compose-lac', title: 'Philipp Lackner: Compose Course', type: 'video', url: 'https://www.youtube.com/playlist?list=PLQkwcJG4YTSTuV2-76n-VnO0ETo-H4z6w' }
                    ]
                },
                {
                    id: 'compose-advanced',
                    title: 'Advanced Animations',
                    description: 'Lottie, Compose animations, and effects.',
                    resources: [
                        { id: 'compose-anim', title: 'Compose Animation Guide', type: 'article', url: 'https://developer.android.com/jetpack/compose/animation' }
                    ]
                }
            ]
        },
        {
            id: 'android-architecture',
            title: 'Architecture & Persistence',
            description: 'MVVM, Room DB, and Retrofit.',
            subtopics: [
                {
                    id: 'mvvm-basics',
                    title: 'MVVM Architecture',
                    description: 'ViewModel, LiveData, and Data Binding.',
                    resources: [
                        { id: 'arch-docs', title: 'Top-level Architecture', type: 'article', url: 'https://developer.android.com/topic/architecture' },
                        { id: 'arch-lac', title: 'Clean Architecture in Android', type: 'video', url: 'https://www.youtube.com/watch?v=R9_Kxun3LTo' }
                    ]
                },
                {
                    id: 'retrofit-api',
                    title: 'Networking with Retrofit',
                    description: 'API Integration and JSON parsing.',
                    resources: [
                        { id: 'ret-docs', title: 'Retrofit Official Site', type: 'article', url: 'https://square.github.io/retrofit/' },
                        { id: 'ret-vid', title: 'Retrofit + Compose Tutorial', type: 'video', url: 'https://www.youtube.com/watch?v=5VBm2_6y3QY' }
                    ]
                },
                {
                    id: 'room-db',
                    title: 'Local DB with Room',
                    description: 'Persistence with SQLite wrapper.',
                    resources: [
                        { id: 'room-docs', title: 'Room Training', type: 'article', url: 'https://developer.android.com/training/data-storage/room' }
                    ]
                }
            ]
        },
        {
            id: 'android-backend',
            title: 'Cloud & Authentication',
            description: 'Firebase and Remote Config.',
            subtopics: [
                {
                    id: 'firebase-android',
                    title: 'Firebase Integration',
                    description: 'Authentication, Firestore, and Analytics.',
                    resources: [
                        { id: 'fb-docs', title: 'Firebase Android Setup', type: 'article', url: 'https://firebase.google.com/docs/android/setup' }
                    ]
                }
            ]
        },
        {
            id: 'android-milestones',
            title: 'Milestone Projects',
            description: 'Real-world application challenges.',
            subtopics: [
                {
                    id: 'proj-weather-app',
                    title: 'SkyCast: Weather App',
                    description: 'Retrofit + OpenWeather API + Jetpack Compose.',
                    resources: [
                        { id: 'proj-weather', title: 'Weather App Project Guide', type: 'project', url: 'https://github.com/philipplackner/WeatherApp' }
                    ]
                },
                {
                    id: 'proj-todo-app',
                    title: 'TaskMaster',
                    description: 'Clean Architecture + Room + ViewModel.',
                    resources: [
                        { id: 'proj-todo', title: 'Clean Architecture ToDo App', type: 'project', url: 'https://github.com/philipplackner/CleanArchitectureNoteApp' }
                    ]
                }
            ]
        }
    ]
};

export const reactNativeTrack: AppDevTrack = {
    id: 'react-native',
    title: 'React Native (Cross-Platform)',
    description: 'Build for iOS and Android with a single codebase.',
    topics: [
        {
            id: 'rn-basics',
            title: 'Foundations',
            description: 'JavaScript to React Native bridge.',
            subtopics: [
                {
                    id: 'react-refresh',
                    title: 'React Foundations',
                    description: 'JSX, Hooks, and Component Lifecycle.',
                    resources: [
                        { id: 'react-docs', title: 'React Official Docs', type: 'article', url: 'https://react.dev/' }
                    ]
                },
                {
                    id: 'rn-intro',
                    title: 'React Native Core',
                    description: 'View, Text, StyleSheet, and Image.',
                    resources: [
                        { id: 'rn-docs', title: 'Getting Started with RN', type: 'article', url: 'https://reactnative.dev/docs/getting-started' },
                        { id: 'rn-fcc', title: 'React Native Course (10h)', type: 'video', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' }
                    ]
                }
            ]
        },
        {
            id: 'rn-tooling',
            title: 'Expo Ecosystem',
            description: 'Development environment and standard APIs.',
            subtopics: [
                {
                    id: 'expo-basics',
                    title: 'Expo Crash Course',
                    description: 'Managed workflow and EAS.',
                    resources: [
                        { id: 'expo-docs', title: 'Expo Documentation', type: 'article', url: 'https://docs.expo.dev/' },
                        { id: 'expo-vid', title: 'Expo Crash Course Video', type: 'video', url: 'https://www.youtube.com/watch?v=gvkq-nHY_xY' }
                    ]
                }
            ]
        },
        {
            id: 'rn-state',
            title: 'State Management',
            description: 'Managing global app state.',
            subtopics: [
                {
                    id: 'redux-toolkit-rn',
                    title: 'Redux Toolkit',
                    description: 'Slices, Thunks, and Store configuration.',
                    resources: [
                        { id: 'redux-docs', title: 'Redux Toolkit Guide', type: 'article', url: 'https://redux-toolkit.js.org/' },
                        { id: 'redux-vid', title: 'Redux for Beginners', type: 'video', url: 'https://www.youtube.com/watch?v=bbkBuqC1rU4' }
                    ]
                }
            ]
        },
        {
            id: 'rn-milestones',
            title: 'Milestone Projects',
            description: 'Cross-platform app challenges.',
            subtopics: [
                {
                    id: 'proj-nft-marketplace',
                    title: 'NFT Showcase App',
                    description: 'Smooth UI + Responsive Layouts in RN.',
                    resources: [
                        { id: 'proj-nft', title: 'RN NFT App Tutorial', type: 'project', url: 'https://www.youtube.com/watch?v=apS_SPl8_gU' }
                    ]
                }
            ]
        }
    ]
};

export const appDevTracks = [androidTrack, reactNativeTrack];
