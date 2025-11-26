import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getTodayVerse } from '../../data/verses-database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const { userName } = useUser();
  const { isDark, themeColors } = useTheme();
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

  const openSocialMedia = async (platform: string) => {
    let url = '';
    switch (platform) {
      case 'instagram':
        url = 'https://instagram.com/versodiario';
        break;
      case 'youtube':
        url = 'https://youtube.com/@versodiario';
        break;
      case 'tiktok':
        url = 'https://tiktok.com/@versodiario';
        break;
    }
    if (url) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <Text style={[styles.topBarText, { color: themeColors.headerText }]}>🕊️ Verso Diário</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: themeColors.text }]}>
            A Paz do Senhor, {userName}
          </Text>
          <Text style={[styles.greetingSubtext, { color: themeColors.textSecondary }]}>
            {greeting}
          </Text>
        </View>

        {/* Verso do Dia */}
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>
            Verso do Dia
          </Text>
          <Text style={[styles.verseText, { color: themeColors.text }]}>
            "{verse.text}"
          </Text>
          <Text style={[styles.verseReference, { color: themeColors.textSecondary }]}>
            {verse.reference}
          </Text>
          <View style={styles.verseActions}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={shareVerse}>
              <Ionicons name="share-social-outline" size={24} color={themeColors.textSecondary} />
              <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>
                Compartilhar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Devocional do Dia */}
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>
            📖 Devocional do Dia
          </Text>
          <Text style={[styles.devotionalPreview, { color: themeColors.textSecondary }]}>
            Leia a reflexão completa sobre o verso de hoje e fortaleça sua fé.
          </Text>
          <TouchableOpacity
            style={styles.readButton}
            onPress={() => router.push('/devotional-view')}
          >
            <Text style={[styles.readButtonText, { color: themeColors.primary }]}>Ler completo →</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Access Grid */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: themeColors.card }]}
            onPress={() => router.push('/(tabs)/bible')}
          >
            <Ionicons name="book" size={32} color={themeColors.primary} />
            <Text style={[styles.gridText, { color: themeColors.text }]}>
              Bíblia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: themeColors.card }]}
            onPress={() => router.push('/(tabs)/hymnal')}
          >
            <Ionicons name="musical-notes" size={32} color={themeColors.primary} />
            <Text style={[styles.gridText, { color: themeColors.text }]}>
              Hinário
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: themeColors.card }]}
            onPress={() => router.push('/(tabs)/notes')}
          >
            <Ionicons name="create" size={32} color={themeColors.primary} />
            <Text style={[styles.gridText, { color: themeColors.text }]}>
              Anotações
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: themeColors.card }]}
            onPress={() => router.push('/(tabs)/calendar')}
          >
            <Ionicons name="calendar" size={32} color={themeColors.primary} />
            <Text style={[styles.gridText, { color: themeColors.text }]}>
              Calendário
            </Text>
          </TouchableOpacity>
        </View>

        {/* Store Card - Enhanced */}
        <TouchableOpacity
          style={[styles.storeCard, { backgroundColor: themeColors.card }]}
          onPress={() => router.push('/(tabs)/store')}
        >
          <View style={styles.storeCardContent}>
            <View style={styles.storeIconContainer}>
              <Ionicons name="gift" size={40} color={themeColors.primary} />
            </View>
            <View style={styles.storeTextContainer}>
              <Text style={[styles.storeTitle, { color: themeColors.text }]}>
                Loja Verso Diário
              </Text>
              <Text style={[styles.storeSubtitle, { color: themeColors.textSecondary }]}>
                Produtos que inspiram sua fé e fortalecem sua caminhada espiritual
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={themeColors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Social Media Section - Same as Settings */}
        <View style={styles.socialSection}>
          <Text style={[styles.socialTitle, { color: themeColors.textSecondary }]}>
            Redes Sociais
          </Text>
          
          <TouchableOpacity 
            style={[styles.socialItem, { backgroundColor: themeColors.card }]}
            onPress={() => openSocialMedia('instagram')}
          >
            <Ionicons name="logo-instagram" size={24} color="#E1306C" />
            <Text style={[styles.socialText, { color: themeColors.text }]}>
              Instagram
            </Text>
            <Ionicons name="open-outline" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.socialItem, { backgroundColor: themeColors.card }]}
            onPress={() => openSocialMedia('youtube')}
          >
            <Ionicons name="logo-youtube" size={24} color="#FF0000" />
            <Text style={[styles.socialText, { color: themeColors.text }]}>
              YouTube
            </Text>
            <Ionicons name="open-outline" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.socialItem, { backgroundColor: themeColors.card }]}
            onPress={() => openSocialMedia('tiktok')}
          >
            <Ionicons name="logo-tiktok" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            <Text style={[styles.socialText, { color: themeColors.text }]}>
              TikTok
            </Text>
            <Ionicons name="open-outline" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
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
  storeCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  storeTextContainer: {
    flex: 1,
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storeSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  socialSection: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  socialTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  socialText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
