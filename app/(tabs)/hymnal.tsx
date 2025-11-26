import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

const HYMNS_LIST = [
  { number: 1, title: "Chuvas de Bênçãos" },
  { number: 2, title: "Saudai o Nome de Jesus" },
  { number: 3, title: "Castelo Forte" },
  { number: 4, title: "Vencendo Vem Jesus" },
  { number: 5, title: "Vem, Pecador" },
  { number: 6, title: "Paz Divina" },
  { number: 7, title: "Mais Perto da Tua Cruz" },
  { number: 8, title: "Olhai Pro Cordeiro de Deus" },
  { number: 9, title: "Oração de Consagração" },
  { number: 10, title: "Grandioso és Tu" },
  ...Array.from({ length: 10 }, (_, i) => ({
    number: i + 11,
    title: `Hino ${i + 11}`,
  }))
];

export default function Hymnal() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredHymns = HYMNS_LIST.filter(hymn =>
    hymn.title.toLowerCase().includes(search.toLowerCase()) ||
    hymn.number.toString().includes(search)
  );

  const handleHymnPress = (hymnNumber: number) => {
    router.push(`/hymn-player?number=${hymnNumber}`);
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
          Hinário
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Harpa Cristã
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#111827' }]}
            placeholder="Buscar hino..."
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={search}
            onChangeText={setSearch}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Hymns List */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.hymnsList}>
          {filteredHymns.map((hymn) => (
            <TouchableOpacity
              key={hymn.number}
              style={[styles.hymnItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              onPress={() => handleHymnPress(hymn.number)}
            >
              <View style={styles.hymnNumber}>
                <Text style={styles.hymnNumberText}>{hymn.number}</Text>
              </View>
              <View style={styles.hymnInfo}>
                <Text style={[styles.hymnTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {hymn.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Background Music Button */}
      <TouchableOpacity style={styles.musicButton}>
        <Ionicons name="musical-notes" size={24} color="#FFFFFF" />
        <Text style={styles.musicButtonText}>Música de Fundo</Text>
      </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  hymnsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  hymnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    gap: 12,
  },
  hymnNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hymnNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  hymnInfo: {
    flex: 1,
  },
  hymnTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  musicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  musicButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
