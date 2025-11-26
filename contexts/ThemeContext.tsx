import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  isAutoTheme: boolean;
  setAutoTheme: (auto: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === 'dark');
  const [isAutoTheme, setIsAutoThemeState] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (isAutoTheme) {
      setIsDark(systemTheme === 'dark');
    }
  }, [systemTheme, isAutoTheme]);

  const loadThemePreference = async () => {
    try {
      const auto = await AsyncStorage.getItem('autoTheme');
      const manual = await AsyncStorage.getItem('isDarkMode');
      
      if (auto === 'false') {
        setIsAutoThemeState(false);
        setIsDark(manual === 'true');
      } else {
        setIsAutoThemeState(true);
        setIsDark(systemTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newValue = !isDark;
      setIsDark(newValue);
      setIsAutoThemeState(false);
      await AsyncStorage.setItem('isDarkMode', newValue.toString());
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
      }
    } catch (error) {
      console.error('Error setting auto theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isAutoTheme, setAutoTheme }}>
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
