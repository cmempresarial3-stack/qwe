import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Onboarding() {
  const [name, setName] = useState('');
  const router = useRouter();
  const { setUserName } = useUser();
  const { isDark } = useTheme();

  const handleContinue = async () => {
    if (name.trim()) {
      await setUserName(name.trim());
      await AsyncStorage.setItem('hasOnboarded', 'true');
      router.replace('/(tabs)/home');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>🕊️</Text>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          Verso Diário
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Você não está sozinho, viva com propósito
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
            Como podemos te chamar?
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
                color: isDark ? '#FFFFFF' : '#111827',
                borderColor: isDark ? '#374151' : '#E5E7EB',
              }
            ]}
            placeholder="Digite seu nome"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, { opacity: name.trim() ? 1 : 0.5 }]}
            onPress={handleContinue}
            disabled={!name.trim()}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#8B5CF6',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
