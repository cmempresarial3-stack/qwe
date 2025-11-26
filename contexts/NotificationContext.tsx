import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type NotificationContextType = {
  scheduleDailyNotification: (hour: number, minute: number) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  isNotificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isNotificationsEnabled, setIsNotificationsEnabledState] = useState(false);

  useEffect(() => {
    requestPermissions();
    loadNotificationSettings();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setIsNotificationsEnabledState(status === 'granted');
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      setIsNotificationsEnabledState(false);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('notificationsEnabled');
      if (enabled !== null) {
        setIsNotificationsEnabledState(enabled === 'true');
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const setNotificationsEnabled = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', enabled.toString());
      setIsNotificationsEnabledState(enabled);
      
      if (!enabled) {
        await cancelAllNotifications();
      }
    } catch (error) {
      console.error('Error setting notifications:', error);
    }
  };

  const scheduleDailyNotification = async (hour: number, minute: number) => {
    try {
      const userName = await AsyncStorage.getItem('userName') || 'amigo';
      
      const messages = [
        `Oi ${userName}, já orou hoje?`,
        `${userName}, Deus conhece suas lutas, siga firme.`,
        `Que tal ler a Palavra hoje, ${userName}?`,
        `${userName}, você não está sozinho!`,
        `Deus tem um propósito para você, ${userName}.`
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Verso Diário 🕊️',
          body: randomMessage,
          sound: 'notification1.wav',
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      scheduleDailyNotification,
      cancelAllNotifications,
      isNotificationsEnabled,
      setNotificationsEnabled,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
