import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getTodayVerse } from '../../data/verses-database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const { userName } = useUser();
  const { isDark } = useTheme();
  const router = useRouter();
  const [verse, setVerse] = useState({ text: '', reference: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadVerse();
    updateGreeting();
  }, []);

  const loadVerse = async () => {
    const todayVerse = getTodayVerse();
    setVerse(todayVerse);
    
    // Check if already favorited
    const favorites = await AsyncStorage.getItem('favoriteVerses');
    if (favorites) {
      const favList = JSON.parse(favorites);
      setIsFavorite(favList.some((v: any) => v.reference === todayVerse.reference));
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      setGreeting('Que Deus abençoe o seu dia.');
    } else {
      setGreeting('Que Deus abençoe sua noite.');
    }
  };

  const toggleFavorite = async () => {
    const favorites = await AsyncStorage.getItem('favoriteVerses');
    let favList = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      favList = favList.filter((v: any) => v.reference !== verse.reference);
    } else {
      favList.push({ ...verse, date: new Date().toISOString() });
    }
    
    await AsyncStorage.setItem('favoriteVerses', JSON.stringify(favList));
    setIsFavorite(!isFavorite);
  };

  const shareVerse = async () => {
    try {
      await Share.share({
        message: `"${verse.text}"\n\n${verse.reference}\n\n🕊️ Verso Diário`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={styles.topBarText}>🕊️ Verso Diário</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: isDark ? '#E5E7EB' : '#374151' }]}>
            A Paz do Senhor, {userName}
          </Text>
          <Text style={[styles.greetingSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {greeting}
          </Text>
        </View>

        {/* Verso do Dia */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Verso do Dia
          </Text>
          <Text style={[styles.verseText, { color: isDark ? '#E5E7EB' : '#374151' }]}>
            "{verse.text}"
          </Text>
          <Text style={[styles.verseReference, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {verse.reference}
          </Text>
          <View style={styles.verseActions}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={shareVerse}>
              <Ionicons name="share-social-outline" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.actionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Compartilhar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Devocional do Dia */}
        <View style={[styles.card, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            📖 Devocional do Dia
          </Text>
          <Text style={[styles.devotionalPreview, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            Leia a reflexão completa sobre o verso de hoje e fortaleça sua fé.
          </Text>
          <TouchableOpacity
            style={styles.readButton}
            onPress={() => router.push('/devotional-view')}
          >
            <Text style={styles.readButtonText}>Ler completo →</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Access Grid */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
            onPress={() => router.push('/(tabs)/bible')}
          >
            <Ionicons name="book" size={32} color="#8B5CF6" />
            <Text style={[styles.gridText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Bíblia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
            onPress={() => router.push('/(tabs)/hymnal')}
          >
            <Ionicons name="musical-notes" size={32} color="#8B5CF6" />
            <Text style={[styles.gridText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Hinário
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
            onPress={() => router.push('/notes')}
          >
            <Ionicons name="create" size={32} color="#8B5CF6" />
            <Text style={[styles.gridText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Anotações
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
            onPress={() => router.push('/calendar')}
          >
            <Ionicons name="calendar" size={32} color="#8B5CF6" />
            <Text style={[styles.gridText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Calendário
            </Text>
          </TouchableOpacity>
        </View>

        {/* Store and Social Media */}
        <TouchableOpacity
          style={[styles.horizontalCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
          onPress={() => router.push('/(tabs)/store')}
        >
          <Ionicons name="cart" size={24} color="#8B5CF6" />
          <Text style={[styles.horizontalCardText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Loja
          </Text>
          <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.horizontalCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
        >
          <Ionicons name="logo-instagram" size={24} color="#E1306C" />
          <Text style={[styles.horizontalCardText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Redes Sociais
          </Text>
          <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  topBarText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  greeting: {
    padding: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 16,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  verseReference: {
    fontSize: 14,
    marginBottom: 16,
  },
  verseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
  },
  devotionalPreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  readButton: {
    alignSelf: 'flex-start',
  },
  readButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  gridItem: {
    width: '47%',
    margin: '1.5%',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  horizontalCardText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
