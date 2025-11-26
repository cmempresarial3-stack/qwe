import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import * as Speech from 'expo-speech';

type BibleVerse = {
  verse: number;
  text: string;
};

type BibleChapter = BibleVerse[];

type RawBibleBook = {
  abbrev: string;
  name: string;
  chapters: string[][];
};

type BibleData = Record<string, Record<string, BibleChapter>>;

let BIBLE_CACHE: BibleData | null = null;

function loadBibleData(): BibleData {
  if (!BIBLE_CACHE) {
    try {
      const rawData: RawBibleBook[] = require('../data/bible-acf.json');
      
      BIBLE_CACHE = {};
      rawData.forEach((book) => {
        const bookName = book.name;
        BIBLE_CACHE![bookName] = {};
        
        book.chapters.forEach((chapterVerses, chapterIndex) => {
          const chapterNum = (chapterIndex + 1).toString();
          BIBLE_CACHE![bookName][chapterNum] = chapterVerses.map((text, verseIndex) => ({
            verse: verseIndex + 1,
            text,
          }));
        });
      });
    } catch (error) {
      console.error('Error loading Bible data:', error);
      BIBLE_CACHE = {};
    }
  }
  return BIBLE_CACHE;
}

export default function BibleReaderScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const book = params.book as string || 'João';
  const chapterNum = params.chapter as string || '3';
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChapter = async () => {
      try {
        setIsLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const bibleData = loadBibleData();
        const loadedVerses = bibleData[book]?.[chapterNum] || [];
        setVerses(loadedVerses);
      } catch (error) {
        console.error('Error loading chapter:', error);
        setVerses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChapter();
  }, [book, chapterNum]);

  const speakChapter = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const fullText = verses.map(v => `Versículo ${v.verse}. ${v.text}`).join('. ');
    
    Speech.speak(fullText, {
      language: 'pt-BR',
      pitch: 1.0,
      rate: 0.85,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const shareChapter = () => {
    const text = `${book} ${chapterNum}\n\n${verses.map(v => `${v.verse}. ${v.text}`).join('\n\n')}\n\n🕊️ Verso Diário`;
    console.log('Share:', text);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            {book} {chapterNum}
          </Text>
          <Text style={[styles.headerSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Almeida Corrigida Fiel
          </Text>
        </View>
        <TouchableOpacity onPress={shareChapter} style={styles.shareButton}>
          <Ionicons name="share-outline" size={22} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
      </View>

      {/* Control Bar */}
      <View style={[styles.controlBar, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={[styles.controlButton, isSpeaking && styles.controlButtonActive]}
          onPress={speakChapter}
        >
          <Ionicons
            name={isSpeaking ? "stop-circle" : "play-circle"}
            size={28}
            color={isSpeaking ? "#EF4444" : "#8B5CF6"}
          />
          <Text style={[styles.controlText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            {isSpeaking ? 'Parar' : 'Ouvir'}
          </Text>
        </TouchableOpacity>

        <View style={styles.fontSizeControl}>
          <TouchableOpacity
            onPress={() => setFontSize(Math.max(12, fontSize - 2))}
            style={styles.fontButton}
          >
            <Ionicons name="remove-circle-outline" size={24} color={isDark ? '#D1D5DB' : '#4B5563'} />
          </TouchableOpacity>
          <Text style={[styles.fontSizeText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            A {fontSize}
          </Text>
          <TouchableOpacity
            onPress={() => setFontSize(Math.min(24, fontSize + 2))}
            style={styles.fontButton}
          >
            <Ionicons name="add-circle-outline" size={24} color={isDark ? '#D1D5DB' : '#4B5563'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Verses */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={[styles.loadingText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Carregando capítulo...
            </Text>
          </View>
        ) : verses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
            <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Capítulo não disponível
            </Text>
            <Text style={[styles.emptySubtext, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
              Este conteúdo ainda não foi carregado
            </Text>
          </View>
        ) : (
          verses.map((v) => (
            <View key={v.verse} style={styles.verseContainer}>
              <View style={styles.verseNumberContainer}>
                <Text style={[styles.verseNumber, { color: '#8B5CF6' }]}>
                  {v.verse}
                </Text>
              </View>
              <Text style={[styles.verseText, { color: isDark ? '#E5E7EB' : '#1F2937', fontSize }]}>
                {v.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Chapter Navigation */}
      <View style={[styles.navigation, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity style={styles.navButton} onPress={() => {}}>
          <Ionicons name="chevron-back" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
          <Text style={[styles.navText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            Anterior
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => {}}>
          <Text style={[styles.navText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            Próximo
          </Text>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  controlButtonActive: {
    backgroundColor: '#FEE2E2',
  },
  controlText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fontSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fontButton: {
    padding: 4,
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  verseNumberContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  verseText: {
    flex: 1,
    lineHeight: 26,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
