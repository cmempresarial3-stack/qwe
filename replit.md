# 🕊️ Verso Diário - Aplicativo Cristão Móvel

## Overview
"Verso Diário" is a React Native + Expo mobile application for Android, designed to provide a comprehensive spiritual experience. Its core message is "You are not alone, live with purpose," offering features like daily verses, a full Bible reader with Text-to-Speech (TTS), a hymnal with audio, note-taking, a spiritual activity calendar, customizable alarms, a Christian product store, and user settings. The project is 100% functional and ready for build.

## User Preferences
- **Coding Style**: Prefer React Native + Expo for mobile development.
- **Language**: All outputs should be in Portuguese.
- **Workflow**: Prefer clear, step-by-step instructions for tasks like APK generation.
- **Error Handling**: Implement robust error boundaries to prevent app crashes and provide a friendly user experience.
- **Local Development**: Detailed instructions for running on Windows are highly valued.
- **Pathing**: **NEVER USE @ PATHS!** Always use relative paths (e.g., `../../contexts/ThemeContext`).
- **Assets**: Ensure all assets are valid and have a size greater than 0 bytes.
- **Build Process**: Provide clear documentation for the build process, including common issues and solutions.
- **Dependencies**: Use pinned versions (exact versions without `^` or `~`) for critical dependencies to ensure consistency across environments, especially Windows.
- **Legacy Peer Deps**: Always use `--legacy-peer-deps` when installing npm packages.
- **Communication**: Prefer concise summaries of changes and issues.

## System Architecture
The application is built with **React Native + Expo SDK 51** and uses **TypeScript**.
- **Navigation**: Expo Router handles file-based routing.
- **State Management**: Achieved using React Hooks and the Context API.
- **Local Storage**: AsyncStorage is used for persisting user data like favorite verses and notes.
- **Audio/Speech**: `expo-av` for audio playback (hymnal) and `expo-speech` for Text-to-Speech in the Bible reader.
- **Notifications**: `expo-notifications` for local, customizable alarms.
- **UI/UX**:
    - **Color Scheme**: Primary Purple (#8B5CF6) with light purple accents (#A78BFA). Dark mode uses #111827 (background) and #1F2937 (cards), while light mode uses #F9FAFB (background) and #FFFFFF (cards).
    - **Typography**: Clear hierarchy with bold titles (24-28px), semi-bold subtitles (14-18px), regular body text (14-16px), and captions (12px).
    - **Design Patterns**: Utilizes common mobile UI patterns such as tab navigation, cards for content display (home, store), and lists with search/filter (Bible, Hymnal, Notes).
- **Core Features**:
    - **Home**: Automatic daily verse rotation, contextual greetings, verse sharing, navigation grid, and social media links.
    - **Bible**: Complete Bible (ACF) with book listing, testament filtering, book search, and a reader with adjustable font size and TTS.
    - **Hymnal**: Harpa Cristã hymns with search, audio player (instrumental placeholders), and full lyrics.
    - **Notes**: Create, edit, delete notes across three categories (Favorite Verses, Devotionals, Personal) with search and filter.
    - **Calendar**: Interactive monthly calendar to track spiritual activities (reading, devotional, prayer) with streak counter and visual indicators.
    - **Alarms**: Customizable alarms with various sounds, repetition options, and local notifications.
    - **Store**: Displays Christian products with category navigation and external links.
    - **Settings**: Dark/light mode, automatic theme switching, user profile management, configurable notifications, and font size adjustment.
- **Security & Privacy**: All user data is stored locally using AsyncStorage, with no external server data transmission or tracking. Notifications are strictly local.

## External Dependencies
- **React Native**: Core framework for mobile app development.
- **Expo SDK 51**: Provides a comprehensive set of tools and APIs for React Native development, including:
    - **Expo Router**: For file-based navigation.
    - **expo-av**: For audio playback.
    - **expo-speech**: For Text-to-Speech functionality.
    - **expo-notifications**: For local notifications and alarms.
    - **expo-splash-screen**: For managing the splash screen.
- **AsyncStorage**: Local data persistence.
- **babel-plugin-module-resolver**: For resolving module imports (installed as a dev dependency).
- **TypeScript**: For type safety.
- **Gradle**: For building Android applications (local build).
- **EAS CLI**: For simplified cloud builds (EAS Build).