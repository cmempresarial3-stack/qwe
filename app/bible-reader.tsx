import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { bibleBooks } from '../data/bible-books';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

type HighlightedVerse = {
  book: string;
  chapter: string;
  verse: number;
  color: string;
  text: string;
};

const HIGHLIGHT_COLORS = [
  { name: 'Amarelo', color: '#FEF08A' },
  { name: 'Verde', color: '#BBF7D0' },
  { name: 'Azul', color: '#BFDBFE' },
  { name: 'Rosa', color: '#FBCFE8' },
];

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
  const { isDark, themeColors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const initialBook = params.book as string || 'João';
  const initialChapter = params.chapter as string || '1';
  
  const [book, setBook] = useState(initialBook);
  const [chapterNum, setChapterNum] = useState(initialChapter);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChapterPicker, setShowChapterPicker] = useState(false);
  const [showTranslationPicker, setShowTranslationPicker] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
  const [highlightedVerses, setHighlightedVerses] = useState<HighlightedVerse[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [translation, setTranslation] = useState('ACF');

  const currentBookInfo = bibleBooks.find(b => b.name === book);
  const totalChapters = currentBookInfo?.chapters || 1;
  const bookIndex = bibleBooks.findIndex(b => b.name === book);

  useEffect(() => {
    loadChapter();
    loadHighlights();
    loadFontSize();
  }, [book, chapterNum]);

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

  const loadHighlights = async () => {
    try {
      const stored = await AsyncStorage.getItem('highlightedVerses');
      if (stored) {
        setHighlightedVerses(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading highlights:', error);
    }
  };

  const loadFontSize = async () => {
    try {
      const stored = await AsyncStorage.getItem('bibleFontSize');
      if (stored) {
        setFontSize(parseInt(stored));
      }
    } catch (error) {
      console.error('Error loading font size:', error);
    }
  };

  const saveFontSize = async (size: number) => {
    try {
      await AsyncStorage.setItem('bibleFontSize', size.toString());
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  };

  const goToNextChapter = () => {
    const currentChapter = parseInt(chapterNum);
    
    if (currentChapter < totalChapters) {
      setChapterNum((currentChapter + 1).toString());
      setSelectedVerses([]);
    } else if (bookIndex < bibleBooks.length - 1) {
      const nextBook = bibleBooks[bookIndex + 1];
      setBook(nextBook.name);
      setChapterNum('1');
      setSelectedVerses([]);
    }
  };

  const goToPreviousChapter = () => {
    const currentChapter = parseInt(chapterNum);
    
    if (currentChapter > 1) {
      setChapterNum((currentChapter - 1).toString());
      setSelectedVerses([]);
    } else if (bookIndex > 0) {
      const prevBook = bibleBooks[bookIndex - 1];
      setBook(prevBook.name);
      setChapterNum(prevBook.chapters.toString());
      setSelectedVerses([]);
    }
  };

  const toggleVerseSelection = (verseNum: number) => {
    setSelectedVerses(prev => {
      if (prev.includes(verseNum)) {
        return prev.filter(v => v !== verseNum);
      }
      return [...prev, verseNum].sort((a, b) => a - b);
    });
  };

  const highlightSelectedVerses = async (color: string) => {
    const newHighlights = [...highlightedVerses];
    
    for (const verseNum of selectedVerses) {
      const verse = verses.find(v => v.verse === verseNum);
      if (verse) {
        const existingIndex = newHighlights.findIndex(
          h => h.book === book && h.chapter === chapterNum && h.verse === verseNum
        );
        
        if (existingIndex >= 0) {
          newHighlights[existingIndex].color = color;
        } else {
          newHighlights.push({
            book,
            chapter: chapterNum,
            verse: verseNum,
            color,
            text: verse.text,
          });
        }
      }
    }
    
    setHighlightedVerses(newHighlights);
    await AsyncStorage.setItem('highlightedVerses', JSON.stringify(newHighlights));
    setSelectedVerses([]);
    setShowColorPicker(false);
  };

  const removeHighlight = async (verseNum: number) => {
    const newHighlights = highlightedVerses.filter(
      h => !(h.book === book && h.chapter === chapterNum && h.verse === verseNum)
    );
    setHighlightedVerses(newHighlights);
    await AsyncStorage.setItem('highlightedVerses', JSON.stringify(newHighlights));
  };

  const getVerseHighlightColor = (verseNum: number): string | null => {
    const highlight = highlightedVerses.find(
      h => h.book === book && h.chapter === chapterNum && h.verse === verseNum
    );
    return highlight?.color || null;
  };

  const shareSelectedVerses = async () => {
    if (selectedVerses.length === 0) return;
    
    const selectedTexts = selectedVerses.map(v => {
      const verse = verses.find(vr => vr.verse === v);
      return verse ? `${v}. ${verse.text}` : '';
    }).filter(Boolean);
    
    const text = `${book} ${chapterNum}:${selectedVerses.join(',')}\n\n${selectedTexts.join('\n')}\n\n🕊️ Verso Diário`;
    
    try {
      await Share.share({ message: text });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const saveToNotes = async () => {
    if (selectedVerses.length === 0) return;
    
    const selectedTexts = selectedVerses.map(v => {
      const verse = verses.find(vr => vr.verse === v);
      return verse ? `${v}. ${verse.text}` : '';
    }).filter(Boolean);
    
    const reference = `${book} ${chapterNum}:${selectedVerses.join(',')}`;
    const text = selectedTexts.join('\n');
    
    try {
      const stored = await AsyncStorage.getItem('savedVerseNotes');
      const notes = stored ? JSON.parse(stored) : [];
      
      notes.push({
        id: Date.now().toString(),
        reference,
        text,
        date: new Date().toISOString(),
        category: 'versos',
      });
      
      await AsyncStorage.setItem('savedVerseNotes', JSON.stringify(notes));
      Alert.alert('Salvo!', 'Versos salvos em Anotações');
      setSelectedVerses([]);
    } catch (error) {
      console.error('Error saving to notes:', error);
    }
  };

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

  const shareChapter = async () => {
    const text = `${book} ${chapterNum}\n\n${verses.map(v => `${v.verse}. ${v.text}`).join('\n\n')}\n\n🕊️ Verso Diário`;
    try {
      await Share.share({ message: text });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const changeFontSize = async (delta: number) => {
    const newSize = Math.min(28, Math.max(12, fontSize + delta));
    setFontSize(newSize);
    await saveFontSize(newSize);
  };

  const canGoPrevious = parseInt(chapterNum) > 1 || bookIndex > 0;
  const canGoNext = parseInt(chapterNum) < totalChapters || bookIndex < bibleBooks.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCenter} onPress={() => setShowChapterPicker(true)}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            {book} {chapterNum}
          </Text>
          <Ionicons name="chevron-down" size={16} color={themeColors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowTranslationPicker(true)} style={styles.translationButton}>
          <Text style={[styles.translationText, { color: themeColors.primary }]}>{translation}</Text>
        </TouchableOpacity>
      </View>

      {/* Control Bar */}
      <View style={[styles.controlBar, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity
          style={[styles.controlButton, isSpeaking && styles.controlButtonActive]}
          onPress={speakChapter}
        >
          <Ionicons
            name={isSpeaking ? "stop-circle" : "play-circle"}
            size={24}
            color={isSpeaking ? "#EF4444" : themeColors.primary}
          />
          <Text style={[styles.controlText, { color: themeColors.textSecondary }]}>
            {isSpeaking ? 'Parar' : 'Ouvir'}
          </Text>
        </TouchableOpacity>

        <View style={styles.fontSizeControl}>
          <TouchableOpacity onPress={() => changeFontSize(-2)} style={styles.fontButton}>
            <Ionicons name="remove-circle-outline" size={22} color={themeColors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.fontSizeText, { color: themeColors.textSecondary }]}>
            A {fontSize}
          </Text>
          <TouchableOpacity onPress={() => changeFontSize(2)} style={styles.fontButton}>
            <Ionicons name="add-circle-outline" size={22} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={shareChapter} style={styles.shareBtn}>
          <Ionicons name="share-outline" size={22} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Selection Actions Bar */}
      {selectedVerses.length > 0 && (
        <View style={[styles.selectionBar, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.selectionText}>
            {selectedVerses.length} verso{selectedVerses.length > 1 ? 's' : ''} selecionado{selectedVerses.length > 1 ? 's' : ''}
          </Text>
          <View style={styles.selectionActions}>
            <TouchableOpacity onPress={() => setShowColorPicker(true)} style={styles.selectionBtn}>
              <Ionicons name="color-palette" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareSelectedVerses} style={styles.selectionBtn}>
              <Ionicons name="share-social" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveToNotes} style={styles.selectionBtn}>
              <Ionicons name="bookmark" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedVerses([])} style={styles.selectionBtn}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Verses */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.primary} />
            <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
              Carregando capítulo...
            </Text>
          </View>
        ) : verses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              Capítulo não disponível
            </Text>
          </View>
        ) : (
          verses.map((v) => {
            const highlightColor = getVerseHighlightColor(v.verse);
            const isSelected = selectedVerses.includes(v.verse);
            
            return (
              <TouchableOpacity 
                key={v.verse} 
                style={[
                  styles.verseContainer,
                  highlightColor && { backgroundColor: highlightColor },
                  isSelected && styles.verseSelected,
                ]}
                onPress={() => toggleVerseSelection(v.verse)}
                onLongPress={() => highlightColor && removeHighlight(v.verse)}
              >
                <View style={styles.verseNumberContainer}>
                  <Text style={[styles.verseNumber, { color: themeColors.primary }]}>
                    {v.verse}
                  </Text>
                </View>
                <Text style={[styles.verseText, { color: themeColors.text, fontSize }]}>
                  {v.text}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Chapter Navigation */}
      <View style={[styles.navigation, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
        <TouchableOpacity 
          style={[styles.navButton, !canGoPrevious && styles.navButtonDisabled]} 
          onPress={goToPreviousChapter}
          disabled={!canGoPrevious}
        >
          <Ionicons name="chevron-back" size={24} color={canGoPrevious ? themeColors.text : themeColors.border} />
          <Text style={[styles.navText, { color: canGoPrevious ? themeColors.textSecondary : themeColors.border }]}>
            Anterior
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.chapterIndicator}
          onPress={() => setShowChapterPicker(true)}
        >
          <Text style={[styles.chapterIndicatorText, { color: themeColors.primary }]}>
            {chapterNum}/{totalChapters}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, !canGoNext && styles.navButtonDisabled]} 
          onPress={goToNextChapter}
          disabled={!canGoNext}
        >
          <Text style={[styles.navText, { color: canGoNext ? themeColors.textSecondary : themeColors.border }]}>
            Próximo
          </Text>
          <Ionicons name="chevron-forward" size={24} color={canGoNext ? themeColors.text : themeColors.border} />
        </TouchableOpacity>
      </View>

      {/* Chapter Picker Modal */}
      <Modal visible={showChapterPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                Selecionar Capítulo
              </Text>
              <TouchableOpacity onPress={() => setShowChapterPicker(false)}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: themeColors.textSecondary }]}>
              {book}
            </Text>
            <ScrollView style={styles.chapterGrid}>
              <View style={styles.chapterGridContent}>
                {Array.from({ length: totalChapters }, (_, i) => i + 1).map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.chapterItem,
                      { backgroundColor: num.toString() === chapterNum ? themeColors.primary : themeColors.background },
                    ]}
                    onPress={() => {
                      setChapterNum(num.toString());
                      setShowChapterPicker(false);
                      setSelectedVerses([]);
                    }}
                  >
                    <Text style={[
                      styles.chapterItemText,
                      { color: num.toString() === chapterNum ? '#FFFFFF' : themeColors.text },
                    ]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Translation Picker Modal */}
      <Modal visible={showTranslationPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                Selecionar Tradução
              </Text>
              <TouchableOpacity onPress={() => setShowTranslationPicker(false)}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.translationItem, translation === 'ACF' && { backgroundColor: themeColors.primary + '20' }]}
              onPress={() => {
                setTranslation('ACF');
                setShowTranslationPicker(false);
              }}
            >
              <Text style={[styles.translationItemText, { color: themeColors.text }]}>
                Almeida Corrigida Fiel (ACF)
              </Text>
              {translation === 'ACF' && <Ionicons name="checkmark" size={20} color={themeColors.primary} />}
            </TouchableOpacity>
            <View style={[styles.translationItem, { opacity: 0.5 }]}>
              <Text style={[styles.translationItemText, { color: themeColors.textSecondary }]}>
                Mais traduções em breve...
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Color Picker Modal */}
      <Modal visible={showColorPicker} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowColorPicker(false)}
        >
          <View style={[styles.colorPickerContent, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.colorPickerTitle, { color: themeColors.text }]}>
              Escolha uma cor
            </Text>
            <View style={styles.colorOptions}>
              {HIGHLIGHT_COLORS.map(item => (
                <TouchableOpacity
                  key={item.color}
                  style={[styles.colorOption, { backgroundColor: item.color }]}
                  onPress={() => highlightSelectedVerses(item.color)}
                >
                  <Text style={styles.colorOptionText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  translationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  translationText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  controlButtonActive: {
    backgroundColor: '#FEE2E2',
  },
  controlText: {
    fontSize: 13,
    fontWeight: '600',
  },
  fontSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fontButton: {
    padding: 4,
  },
  fontSizeText: {
    fontSize: 13,
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'center',
  },
  shareBtn: {
    padding: 8,
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  selectionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  selectionBtn: {
    padding: 6,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
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
    marginBottom: 12,
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 8,
  },
  verseSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  verseNumberContainer: {
    marginRight: 10,
    marginTop: 2,
    minWidth: 24,
  },
  verseNumber: {
    fontSize: 12,
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
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chapterIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  chapterIndicatorText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  chapterGrid: {
    flex: 1,
  },
  chapterGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chapterItem: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  translationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  translationItemText: {
    fontSize: 16,
  },
  colorPickerContent: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  colorPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  colorOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  colorOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
