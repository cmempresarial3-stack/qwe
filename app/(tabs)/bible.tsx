import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { bibleBooks } from '../../data/bible-books';

export default function Bible() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [testament, setTestament] = useState<'all' | 'AT' | 'NT'>('all');

  const filteredBooks = bibleBooks.filter(book => {
    const matchesTestament = testament === 'all' || book.testament === testament;
    const matchesSearch = book.name.toLowerCase().includes(search.toLowerCase());
    return matchesTestament && matchesSearch;
  });

  const handleBookPress = (bookName: string) => {
    router.push(`/bible-reader?book=${encodeURIComponent(bookName)}&chapter=1`);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={styles.topBarText}>🕊️ Verso Diário</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          Bíblia Sagrada
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Almeida Corrigida Fiel (ACF)
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#111827' }]}
            placeholder="Buscar livro..."
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Testament Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, testament === 'all' && styles.filterButtonActive]}
          onPress={() => setTestament('all')}
        >
          <Text style={[styles.filterText, testament === 'all' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, testament === 'AT' && styles.filterButtonActive]}
          onPress={() => setTestament('AT')}
        >
          <Text style={[styles.filterText, testament === 'AT' && styles.filterTextActive]}>
            Antigo Testamento
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, testament === 'NT' && styles.filterButtonActive]}
          onPress={() => setTestament('NT')}
        >
          <Text style={[styles.filterText, testament === 'NT' && styles.filterTextActive]}>
            Novo Testamento
          </Text>
        </TouchableOpacity>
      </View>

      {/* Books List */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.booksList}>
          {filteredBooks.map((book, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.bookItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              onPress={() => handleBookPress(book.name)}
            >
              <View>
                <Text style={[styles.bookName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {book.name}
                </Text>
                <Text style={[styles.bookChapters, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {book.chapters} capítulos
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          ))}
        </View>
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
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 12,
    color: '#374151',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  booksList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  bookName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 12,
  },
});
