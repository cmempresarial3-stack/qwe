import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import BottomTabNavigator from './src/components/BottomTabNavigator';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { notificationService } from './src/utils/notifications';
import { storage } from './src/utils/storage';
import './global.css';

function AppContent() {
  const { theme, isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    checkFirstTime();
    initializeNotifications();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasCompletedWelcome = await storage.getItem('hasCompletedWelcome');
      setShowWelcome(!hasCompletedWelcome);
    } catch (error) {
      console.error('Erro ao verificar primeira execução:', error);
      setShowWelcome(true); // Por segurança, mostra a tela de boas-vindas
    } finally {
      setIsLoading(false);
    }
  };

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
      console.log('Sistema de notificações inicializado');
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (isLoading) {
    return null; // Ou uma tela de loading se preferir
  }

  if (showWelcome) {
    return (
      <SafeAreaProvider>
        <WelcomeScreen onComplete={handleWelcomeComplete} />
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomTabNavigator />
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
