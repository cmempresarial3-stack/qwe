import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const HYMNS_DATA = require('../../data/hymns.json');

const HYMNS_LIST = Object.keys(HYMNS_DATA)
  .filter(key => key !== '-1')
  .map(key => ({
    number: parseInt(key),
    title: HYMNS_DATA[key].hino?.split(' - ')[1] || `Hino ${key}`,
  }))
  .sort((a, b) => a.number - b.number);

const AMBIENT_MUSIC = [
  { id: 1, name: 'Relaxamento', icon: 'leaf', color: '#10B981' },
  { id: 2, name: 'Meditação', icon: 'flower', color: '#8B5CF6' },
  { id: 3, name: 'Oração', icon: 'hand-right', color: '#F59E0B' },
  { id: 4, name: 'Adoração', icon: 'heart', color: '#EF4444' },
  { id: 5, name: 'Natureza', icon: 'water', color: '#3B82F6' },
];

export default function Hymnal() {
  const { isDark, themeColors } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'todos' | 'favoritos' | 'recentes'>('todos');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [recents, setRecents] = useState<number[]>([]);
  const [showAmbientModal, setShowAmbientModal] = useState(false);
  const [ambientSound, setAmbientSound] = useState<Audio.Sound | null>(null);
  const [playingAmbient, setPlayingAmbient] = useState<number | null>(null);

  useEffect(() => {
    loadFavorites();
    loadRecents();
    return () => {
      if (ambientSound) {
        ambientSound.unloadAsync();
      }
    };
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('hymnFavorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadRecents = async () => {
    try {
      const stored = await AsyncStorage.getItem('hymnRecents');
      if (stored) {
        setRecents(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recents:', error);
    }
  };

  const toggleFavorite = async (hymnNumber: number) => {
    let newFavorites: number[];
    if (favorites.includes(hymnNumber)) {
      newFavorites = favorites.filter(f => f !== hymnNumber);
    } else {
      newFavorites = [...favorites, hymnNumber];
    }
    setFavorites(newFavorites);
    await AsyncStorage.setItem('hymnFavorites', JSON.stringify(newFavorites));
  };

  const addToRecents = async (hymnNumber: number) => {
    const newRecents = [hymnNumber, ...recents.filter(r => r !== hymnNumber)].slice(0, 5);
    setRecents(newRecents);
    await AsyncStorage.setItem('hymnRecents', JSON.stringify(newRecents));
  };

  const handleHymnPress = async (hymnNumber: number) => {
    await addToRecents(hymnNumber);
    router.push(`/hymn-player?number=${hymnNumber}`);
  };

  const toggleAmbientMusic = async (musicId: number) => {
    try {
      if (playingAmbient === musicId) {
        if (ambientSound) {
          await ambientSound.stopAsync();
          await ambientSound.unloadAsync();
        }
        setAmbientSound(null);
        setPlayingAmbient(null);
      } else {
        if (ambientSound) {
          await ambientSound.stopAsync();
          await ambientSound.unloadAsync();
        }
        
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/gentle.wav'),
          { shouldPlay: true, isLooping: true }
        );
        setAmbientSound(sound);
        setPlayingAmbient(musicId);
      }
    } catch (error) {
      console.error('Error with ambient music:', error);
    }
  };

  const getFilteredHymns = () => {
    let hymns = HYMNS_LIST;
    
    if (activeTab === 'favoritos') {
      hymns = hymns.filter(h => favorites.includes(h.number));
    } else if (activeTab === 'recentes') {
      hymns = recents.map(r => HYMNS_LIST.find(h => h.number === r)).filter(Boolean) as typeof HYMNS_LIST;
    }
    
    if (search) {
      hymns = hymns.filter(hymn =>
        hymn.title.toLowerCase().includes(search.toLowerCase()) ||
        hymn.number.toString().includes(search)
      );
    }
    
    return hymns;
  };

  const filteredHymns = getFilteredHymns();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <Text style={[styles.topBarText, { color: themeColors.headerText }]}>🕊️ Verso Diário</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Hinário
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Harpa Cristã - {HYMNS_LIST.length} hinos
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'todos' && { backgroundColor: themeColors.primary }]}
          onPress={() => setActiveTab('todos')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'todos' ? '#FFFFFF' : themeColors.textSecondary }]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favoritos' && { backgroundColor: themeColors.primary }]}
          onPress={() => setActiveTab('favoritos')}
        >
          <Ionicons 
            name="heart" 
            size={14} 
            color={activeTab === 'favoritos' ? '#FFFFFF' : themeColors.textSecondary} 
          />
          <Text style={[styles.tabText, { color: activeTab === 'favoritos' ? '#FFFFFF' : themeColors.textSecondary }]}>
            Favoritos ({favorites.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recentes' && { backgroundColor: themeColors.primary }]}
          onPress={() => setActiveTab('recentes')}
        >
          <Ionicons 
            name="time" 
            size={14} 
            color={activeTab === 'recentes' ? '#FFFFFF' : themeColors.textSecondary} 
          />
          <Text style={[styles.tabText, { color: activeTab === 'recentes' ? '#FFFFFF' : themeColors.textSecondary }]}>
            Recentes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: themeColors.card }]}>
          <Ionicons name="search" size={20} color={themeColors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Buscar hino por número ou título..."
            placeholderTextColor={themeColors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Hymns List */}
      <ScrollView style={styles.scrollView}>
        {filteredHymns.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes-outline" size={48} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              {activeTab === 'favoritos' ? 'Nenhum hino favorito ainda' : 
               activeTab === 'recentes' ? 'Nenhum hino recente' : 
               'Nenhum hino encontrado'}
            </Text>
          </View>
        ) : (
          <View style={styles.hymnsList}>
            {filteredHymns.map((hymn) => (
              <TouchableOpacity
                key={hymn.number}
                style={[styles.hymnItem, { backgroundColor: themeColors.card }]}
                onPress={() => handleHymnPress(hymn.number)}
              >
                <View style={[styles.hymnNumber, { backgroundColor: themeColors.primary }]}>
                  <Text style={styles.hymnNumberText}>{hymn.number}</Text>
                </View>
                <View style={styles.hymnInfo}>
                  <Text style={[styles.hymnTitle, { color: themeColors.text }]} numberOfLines={1}>
                    {hymn.title}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.favoriteBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(hymn.number);
                  }}
                >
                  <Ionicons 
                    name={favorites.includes(hymn.number) ? 'heart' : 'heart-outline'} 
                    size={22} 
                    color={favorites.includes(hymn.number) ? '#EF4444' : themeColors.textSecondary} 
                  />
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Background Music Button */}
      <TouchableOpacity 
        style={[styles.musicButton, { backgroundColor: themeColors.primary }]}
        onPress={() => setShowAmbientModal(true)}
      >
        <Ionicons name={playingAmbient ? "pause" : "musical-notes"} size={20} color="#FFFFFF" />
        <Text style={styles.musicButtonText}>
          {playingAmbient ? 'Música Tocando' : 'Música de Fundo'}
        </Text>
      </TouchableOpacity>

      {/* Ambient Music Modal */}
      <Modal visible={showAmbientModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                Música de Fundo
              </Text>
              <TouchableOpacity onPress={() => setShowAmbientModal(false)}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: themeColors.textSecondary }]}>
              Músicas para meditação e oração
            </Text>
            
            <View style={styles.ambientList}>
              {AMBIENT_MUSIC.map(music => (
                <TouchableOpacity
                  key={music.id}
                  style={[
                    styles.ambientItem,
                    { backgroundColor: themeColors.background },
                    playingAmbient === music.id && { borderColor: music.color, borderWidth: 2 }
                  ]}
                  onPress={() => toggleAmbientMusic(music.id)}
                >
                  <View style={[styles.ambientIcon, { backgroundColor: music.color + '20' }]}>
                    <Ionicons name={music.icon as any} size={24} color={music.color} />
                  </View>
                  <Text style={[styles.ambientName, { color: themeColors.text }]}>
                    {music.name}
                  </Text>
                  {playingAmbient === music.id && (
                    <View style={[styles.playingIndicator, { backgroundColor: music.color }]}>
                      <Ionicons name="volume-high" size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            {playingAmbient && (
              <TouchableOpacity
                style={[styles.stopButton, { backgroundColor: '#EF4444' }]}
                onPress={() => toggleAmbientMusic(playingAmbient)}
              >
                <Ionicons name="stop" size={20} color="#FFFFFF" />
                <Text style={styles.stopButtonText}>Parar Música</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
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
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    gap: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  hymnsList: {
    paddingHorizontal: 16,
  },
  hymnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  hymnNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 15,
    fontWeight: '600',
  },
  favoriteBtn: {
    padding: 8,
  },
  musicButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  musicButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 20,
  },
  ambientList: {
    gap: 12,
  },
  ambientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  ambientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  playingIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
