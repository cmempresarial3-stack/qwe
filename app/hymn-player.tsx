import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HYMNS_DATA = require('../data/hymns.json');

function parseHymnLyrics(hymnData: any): string[] {
  if (!hymnData) return ['Letra não disponível'];
  
  const lines: string[] = [];
  
  if (hymnData.verses) {
    const verseKeys = Object.keys(hymnData.verses).sort((a, b) => parseInt(a) - parseInt(b));
    
    for (const key of verseKeys) {
      const verse = hymnData.verses[key];
      lines.push(`${key}.`);
      const verseLines = verse.split('<br>').map((l: string) => l.trim()).filter((l: string) => l);
      lines.push(...verseLines);
      lines.push('');
    }
  }
  
  if (hymnData.coro) {
    lines.push('Coro:');
    const coroLines = hymnData.coro.split('<br>').map((l: string) => l.trim()).filter((l: string) => l);
    lines.push(...coroLines);
    lines.push('');
  }
  
  return lines.length > 0 ? lines : ['Letra não disponível'];
}

export default function HymnPlayerScreen() {
  const { isDark, themeColors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const hymnNumber = parseInt(params.number as string) || 1;
  const hymnData = HYMNS_DATA[hymnNumber.toString()];
  const hymnTitle = hymnData?.hino?.split(' - ')[1] || `Hino ${hymnNumber}`;
  const lyrics = parseHymnLyrics(hymnData);
  
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadFontSize();
    checkFavorite();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadFontSize = async () => {
    try {
      const stored = await AsyncStorage.getItem('hymnFontSize');
      if (stored) {
        setFontSize(parseInt(stored));
      }
    } catch (error) {
      console.error('Error loading font size:', error);
    }
  };

  const saveFontSize = async (size: number) => {
    try {
      await AsyncStorage.setItem('hymnFontSize', size.toString());
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  };

  const checkFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem('hymnFavorites');
      if (stored) {
        const favorites = JSON.parse(stored);
        setIsFavorite(favorites.includes(hymnNumber));
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem('hymnFavorites');
      let favorites = stored ? JSON.parse(stored) : [];
      
      if (isFavorite) {
        favorites = favorites.filter((f: number) => f !== hymnNumber);
      } else {
        favorites.push(hymnNumber);
      }
      
      await AsyncStorage.setItem('hymnFavorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const changeFontSize = async (delta: number) => {
    const newSize = Math.min(28, Math.max(14, fontSize + delta));
    setFontSize(newSize);
    await saveFontSize(newSize);
  };

  const loadAudio = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/gentle.wav'),
        { shouldPlay: true, isLooping: true }
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const shareHymn = async () => {
    const lyricsText = lyrics.filter(l => l !== '').join('\n');
    const text = `${hymnTitle}\nHarpa Cristã - Nº ${hymnNumber}\n\n${lyricsText}\n\n🕊️ Verso Diário`;
    
    try {
      await Share.share({ message: text });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]} numberOfLines={1}>
          Hino {hymnNumber}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.headerBtn}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={22} 
              color={isFavorite ? '#EF4444' : themeColors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareHymn} style={styles.headerBtn}>
            <Ionicons name="share-outline" size={22} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mini Player - Discrete at top */}
      <View style={[styles.miniPlayer, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity
          style={[styles.miniPlayBtn, { backgroundColor: themeColors.primary }]}
          onPress={togglePlayPause}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <Text style={[styles.miniPlayerText, { color: themeColors.textSecondary }]}>
          {isPlaying ? 'Tocando instrumental...' : 'Tocar instrumental'}
        </Text>
        <View style={styles.fontSizeControl}>
          <TouchableOpacity onPress={() => changeFontSize(-2)} style={styles.fontBtn}>
            <Ionicons name="remove-circle-outline" size={22} color={themeColors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.fontSizeText, { color: themeColors.textSecondary }]}>
            A
          </Text>
          <TouchableOpacity onPress={() => changeFontSize(2)} style={styles.fontBtn}>
            <Ionicons name="add-circle-outline" size={22} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lyrics */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.hymnTitle, { color: themeColors.text }]}>
          {hymnTitle}
        </Text>
        <Text style={[styles.hymnSubtitle, { color: themeColors.textSecondary }]}>
          Harpa Cristã - Nº {hymnNumber}
        </Text>
        
        <View style={styles.lyricsContainer}>
          {lyrics.map((line, index) => {
            const isVerseNumber = /^\d+\.$/.test(line);
            const isCoro = line === 'Coro:';
            const isEmpty = line === '';
            
            return (
              <Text
                key={index}
                style={[
                  styles.lyricLine,
                  { color: themeColors.text, fontSize },
                  isVerseNumber && styles.verseNumberLine,
                  isCoro && [styles.coroLine, { color: themeColors.primary }],
                  isEmpty && styles.emptyLine,
                ]}
              >
                {line}
              </Text>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            Harpa Cristã - Hinário Evangélico
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerBtn: {
    padding: 8,
  },
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  miniPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPlayerText: {
    flex: 1,
    fontSize: 13,
  },
  fontSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fontBtn: {
    padding: 4,
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  hymnTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  hymnSubtitle: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  lyricsContainer: {
    gap: 4,
  },
  lyricLine: {
    lineHeight: 32,
    textAlign: 'center',
  },
  verseNumberLine: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  coroLine: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyLine: {
    height: 16,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});
