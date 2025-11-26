import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserContextType = {
  userName: string | null;
  memberSince: string | null;
  profileImage: string | null;
  setUserName: (name: string) => Promise<void>;
  setProfileImage: (uri: string) => Promise<void>;
  loadUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [profileImage, setProfileImageState] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const since = await AsyncStorage.getItem('memberSince');
      const image = await AsyncStorage.getItem('profileImage');
      
      setUserNameState(name);
      setMemberSince(since);
      setProfileImageState(image);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const setUserName = async (name: string) => {
    try {
      await AsyncStorage.setItem('userName', name);
      setUserNameState(name);
      
      // Set member since date if not already set
      const since = await AsyncStorage.getItem('memberSince');
      if (!since) {
        const date = new Date().toISOString().split('T')[0];
        await AsyncStorage.setItem('memberSince', date);
        setMemberSince(date);
      }
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  const setProfileImage = async (uri: string) => {
    try {
      await AsyncStorage.setItem('profileImage', uri);
      setProfileImageState(uri);
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      userName, 
      memberSince, 
      profileImage, 
      setUserName, 
      setProfileImage,
      loadUser 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
