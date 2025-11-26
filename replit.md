# 🕊️ Verso Diário - Aplicativo Cristão Móvel

## Overview
"Verso Diário" is a React Native + Expo mobile application for Android, designed to provide a comprehensive spiritual experience. Its core message is "You are not alone, live with purpose," offering features like daily verses, a full Bible reader with Text-to-Speech (TTS), a hymnal with audio, note-taking, a spiritual activity calendar, customizable alarms, a Christian product store, and user settings. The project is 100% functional and ready for build.

## Recent Changes (November 2025)
- **Tab Bar**: Reduced from 7 to 5 tabs (Home, Bible, Hymnal, Store, Settings). Notes and Calendar are now accessible via the Home screen grid.
- **Multi-Theme Support**: Added theme selector in Settings with 4 options: Default (purple), Dark, Pink, and Yellow. Each theme has a complete color palette including primary, background, card, text, and accent colors.
- **Bible Reader Enhancements**:
  - Translation selector (ACF currently available, more translations coming soon)
  - Improved chapter navigation with previous/next book support
  - Verse highlighting with 4 colors (yellow, green, blue, pink)
  - Verse selection for sharing and saving to notes
  - Font size adjustment
  - Text-to-Speech for entire chapters
- **Hymnal Improvements**:
  - Complete 640 hymns from Harpa Cristã loaded from hymns.json
  - Favorites system with heart icon toggle
  - Recent hymns tracking (last 5 viewed)
  - Ambient music player with 5 meditation options
  - Full lyrics parsing with verse numbers and chorus formatting
- **Hymn Player Updates**:
  - Complete lyrics display from JSON data
  - Discrete mini player at top
  - Font size adjustment
  - Share hymn functionality
  - Favorite toggle
- **Settings Page**:
  - Theme color selector grid
  - Automatic theme toggle
  - Feedback section with email sending
  - Social media links (Instagram, YouTube, TikTok)
- **Store Page**:
  - Promotional banner with "Free shipping over R$99" badge
  - Product categories section
  - Enhanced product cards with icons
- **Calendar Enhancements**:
  - Event creation with title, time, and type
  - Notification scheduling for events
  - Activity tracking (reading, devotional, prayer)
  - Consecutive days streak counter
- **Alarms System**:
  - Morning preset alarm (7:00 default) - "Start the day with the Word"
  - Night preset alarm (21:00 default) - "Reflection before bed"
  - Custom alarms with day selection
  - Sound selection with preview

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
- **Local Storage**: AsyncStorage is used for persisting user data like favorite verses, notes, highlights, and preferences.
- **Audio/Speech**: `expo-av` for audio playback (hymnal) and `expo-speech` for Text-to-Speech in the Bible reader.
- **Notifications**: `expo-notifications` for local, customizable alarms and event reminders.
- **UI/UX**:
    - **Theme System**: Multi-theme support with 4 color schemes (default purple, dark, pink, yellow). Each theme provides: primary, primaryLight, background, card, text, textSecondary, border, headerText, and accent colors.
    - **Typography**: Clear hierarchy with bold titles (24-28px), semi-bold subtitles (14-18px), regular body text (14-16px), and captions (12px).
    - **Design Patterns**: Utilizes common mobile UI patterns such as tab navigation (5 tabs), cards for content display, and lists with search/filter.
- **Core Features**:
    - **Home**: Automatic daily verse rotation, contextual greetings, verse sharing, navigation grid (Bible, Hymnal, Notes, Calendar), store card, and social media links.
    - **Bible**: Complete Bible (ACF - 66 books) with testament filtering, book search, translation selector, verse highlighting, font size control, and TTS.
    - **Hymnal**: Complete Harpa Cristã (640 hymns) with search, favorites, recents, ambient music player, and full lyrics display.
    - **Notes**: Create, edit, delete notes across three categories (Favorite Verses, Devotionals, Personal) with search and filter.
    - **Calendar**: Interactive monthly calendar to track spiritual activities, event creation with notifications, and streak counter.
    - **Alarms**: Morning/night preset alarms plus custom alarms with sound selection and day repetition.
    - **Store**: Promotional banner, product categories, and Christian products display.
    - **Settings**: Theme selector, dark/light mode, automatic theme, profile management, notifications, and feedback section.
- **Security & Privacy**: All user data is stored locally using AsyncStorage, with no external server data transmission or tracking. Notifications are strictly local.

## Key Files
- `app/(tabs)/_layout.tsx` - Tab bar configuration (5 tabs)
- `contexts/ThemeContext.tsx` - Multi-theme system (4 themes)
- `app/(tabs)/home.tsx` - Home screen with grid and social links
- `app/bible-reader.tsx` - Bible reader with highlighting and TTS
- `app/(tabs)/hymnal.tsx` - Hymnal list with favorites and recents
- `app/hymn-player.tsx` - Hymn player with lyrics and controls
- `app/(tabs)/settings.tsx` - Settings with theme selector and feedback
- `app/(tabs)/store.tsx` - Store with promotional banner
- `app/(tabs)/calendar.tsx` - Calendar with events
- `app/alarms.tsx` - Alarms with morning/night presets
- `data/hymns.json` - Complete 640 hymns database
- `data/bible-acf.json` - Complete ACF Bible (66 books)

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
