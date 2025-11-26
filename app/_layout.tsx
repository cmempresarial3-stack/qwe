import { useEffect, useCallback, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '../contexts/ThemeContext';
import { UserProvider } from '../contexts/UserContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [hasLayout, setHasLayout] = useState(false);

  useEffect(() => {
    setAppIsReady(true);
  }, []);

  useEffect(() => {
    if (appIsReady && hasLayout) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appIsReady, hasLayout]);

  const onLayoutRootView = useCallback(() => {
    setHasLayout(true);
  }, []);

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ErrorBoundary>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="devotional-view" />
          <Stack.Screen name="hymn-player" />
          <Stack.Screen name="bible-reader" />
          <Stack.Screen name="alarms" />
        </Stack>
      </ErrorBoundary>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <RootNavigator />
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
