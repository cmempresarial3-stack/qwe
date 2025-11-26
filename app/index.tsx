import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      const userName = await AsyncStorage.getItem('userName');
      
      if (hasOnboarded === 'true' && userName) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
      router.replace('/onboarding');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#8B5CF6" />
    </View>
  );
}
