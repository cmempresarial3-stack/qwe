import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeName = 'default' | 'dark' | 'pink' | 'yellow';

export type ThemeColors = {
  primary: string;
  primaryLight: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  headerText: string;
  accent: string;
};

const THEMES: Record<ThemeName, ThemeColors> = {
  default: {
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    headerText: '#111827',
    accent: '#8B5CF6',
  },
  dark: {
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    background: '#111827',
    card: '#1F2937',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: '#374151',
    headerText: '#FFFFFF',
    accent: '#A78BFA',
  },
  pink: {
    primary: '#EC4899',
    primaryLight: '#F472B6',
    background: '#FDF2F8',
    card: '#FFFFFF',
    text: '#831843',
    textSecondary: '#9D174D',
    border: '#FBCFE8',
    headerText: '#EC4899',
    accent: '#EC4899',
  },
  yellow: {
    primary: '#F59E0B',
    primaryLight: '#FBBF24',
    background: '#FFFBEB',
    card: '#FFFFFF',
    text: '#78350F',
    textSecondary: '#92400E',
    border: '#FDE68A',
    headerText: '#F59E0B',
    accent: '#F59E0B',
  },
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  isAutoTheme: boolean;
  setAutoTheme: (auto: boolean) => void;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  themeColors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === 'dark');
  const [isAutoTheme, setIsAutoThemeState] = useState(true);
  const [themeName, setThemeNameState] = useState<ThemeName>('default');

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (isAutoTheme) {
      setIsDark(systemTheme === 'dark');
      if (systemTheme === 'dark') {
        setThemeNameState('dark');
      } else {
        setThemeNameState('default');
      }
    }
  }, [systemTheme, isAutoTheme]);

  const loadThemePreference = async () => {
    try {
      const auto = await AsyncStorage.getItem('autoTheme');
      const savedTheme = await AsyncStorage.getItem('themeName');
      
      if (auto === 'false') {
        setIsAutoThemeState(false);
        if (savedTheme && (savedTheme === 'default' || savedTheme === 'dark' || savedTheme === 'pink' || savedTheme === 'yellow')) {
          setThemeNameState(savedTheme);
          setIsDark(savedTheme === 'dark');
        }
      } else {
        setIsAutoThemeState(true);
        setIsDark(systemTheme === 'dark');
        setThemeNameState(systemTheme === 'dark' ? 'dark' : 'default');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      setIsAutoThemeState(false);
      const newThemeName = newIsDark ? 'dark' : 'default';
      setThemeNameState(newThemeName);
      await AsyncStorage.setItem('themeName', newThemeName);
      await AsyncStorage.setItem('autoTheme', 'false');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setAutoTheme = async (auto: boolean) => {
    try {
      setIsAutoThemeState(auto);
      await AsyncStorage.setItem('autoTheme', auto.toString());
      if (auto) {
        setIsDark(systemTheme === 'dark');
        setThemeNameState(systemTheme === 'dark' ? 'dark' : 'default');
      }
    } catch (error) {
      console.error('Error setting auto theme:', error);
    }
  };

  const setThemeName = async (name: ThemeName) => {
    try {
      setThemeNameState(name);
      setIsDark(name === 'dark');
      setIsAutoThemeState(false);
      await AsyncStorage.setItem('themeName', name);
      await AsyncStorage.setItem('autoTheme', 'false');
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  const themeColors = THEMES[themeName];

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme, 
      isAutoTheme, 
      setAutoTheme, 
      themeName, 
      setThemeName, 
      themeColors 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
