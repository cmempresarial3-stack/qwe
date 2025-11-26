import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'favorite_verses' | 'devotionals' | 'personal';
  reference?: string;
  createdAt: string;
}

export default function NotesScreen() {
  const { isDark } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [category, setCategory] = useState<'all' | 'favorite_verses' | 'devotionals' | 'personal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'favorite_verses' | 'devotionals' | 'personal'>('personal');

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, category, searchQuery]);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem('notes');
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const filterNotes = () => {
    let filtered = notes;
    
    if (category !== 'all') {
      filtered = filtered.filter(n => n.category === category);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query) ||
        (n.reference && n.reference.toLowerCase().includes(query))
      );
    }
    
    setFilteredNotes(filtered);
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const newNote: Note = {
        id: editingNote?.id || Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory,
        createdAt: editingNote?.createdAt || new Date().toISOString(),
      };

      const updatedNotes = editingNote
        ? notes.map(n => n.id === editingNote.id ? newNote : n)
        : [...notes, newNote];

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      closeModal();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const updatedNotes = notes.filter(n => n.id !== id);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const openModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
      setSelectedCategory(note.category);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
      setSelectedCategory('personal');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'favorite_verses': return 'heart';
      case 'devotionals': return 'book';
      case 'personal': return 'create';
      default: return 'document-text';
    }
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'favorite_verses': return 'Versos Favoritos';
      case 'devotionals': return 'Devocionais';
      case 'personal': return 'Notas Pessoais';
      default: return 'Todas';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          🕊️ Verso Diário
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#111827' }]}
            placeholder="Buscar anotações..."
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <View style={styles.categories}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === 'all' && styles.categoryButtonActive,
              { backgroundColor: category === 'all' ? '#8B5CF6' : (isDark ? '#374151' : '#F3F4F6') }
            ]}
            onPress={() => setCategory('all')}
          >
            <Text style={[styles.categoryText, category === 'all' && styles.categoryTextActive]}>
              Todas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === 'favorite_verses' && styles.categoryButtonActive,
              { backgroundColor: category === 'favorite_verses' ? '#8B5CF6' : (isDark ? '#374151' : '#F3F4F6') }
            ]}
            onPress={() => setCategory('favorite_verses')}
          >
            <Ionicons name="heart" size={16} color={category === 'favorite_verses' ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563')} />
            <Text style={[styles.categoryText, category === 'favorite_verses' && styles.categoryTextActive]}>
              Versos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === 'devotionals' && styles.categoryButtonActive,
              { backgroundColor: category === 'devotionals' ? '#8B5CF6' : (isDark ? '#374151' : '#F3F4F6') }
            ]}
            onPress={() => setCategory('devotionals')}
          >
            <Ionicons name="book" size={16} color={category === 'devotionals' ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563')} />
            <Text style={[styles.categoryText, category === 'devotionals' && styles.categoryTextActive]}>
              Devocionais
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === 'personal' && styles.categoryButtonActive,
              { backgroundColor: category === 'personal' ? '#8B5CF6' : (isDark ? '#374151' : '#F3F4F6') }
            ]}
            onPress={() => setCategory('personal')}
          >
            <Ionicons name="create" size={16} color={category === 'personal' ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563')} />
            <Text style={[styles.categoryText, category === 'personal' && styles.categoryTextActive]}>
              Pessoais
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Notes List */}
      <ScrollView style={styles.notesList}>
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
            <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Nenhuma anotação encontrada
            </Text>
            <Text style={[styles.emptySubtext, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
              Toque no botão + para criar sua primeira anotação
            </Text>
          </View>
        ) : (
          filteredNotes.map(note => (
            <View key={note.id} style={[styles.noteCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
              <View style={styles.noteHeader}>
                <View style={styles.noteTitleRow}>
                  <Ionicons
                    name={getCategoryIcon(note.category)}
                    size={18}
                    color="#8B5CF6"
                  />
                  <Text style={[styles.noteTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                    {note.title}
                  </Text>
                </View>
                <View style={styles.noteActions}>
                  <TouchableOpacity onPress={() => openModal(note)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.noteContent, { color: isDark ? '#D1D5DB' : '#4B5563' }]} numberOfLines={3}>
                {note.content}
              </Text>
              <View style={styles.noteFooter}>
                <Text style={[styles.noteCategory, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {getCategoryName(note.category)}
                </Text>
                <Text style={[styles.noteDate, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                  {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => openModal()}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {editingNote ? 'Editar Anotação' : 'Nova Anotação'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Categoria</Text>
            <View style={styles.categorySelector}>
              <TouchableOpacity
                style={[
                  styles.categorySelectorButton,
                  selectedCategory === 'favorite_verses' && styles.categorySelectorButtonActive,
                  { backgroundColor: selectedCategory === 'favorite_verses' ? '#8B5CF6' : (isDark ? '#374151' : '#F3F4F6') }
                ]}
                onPress={() => setSelectedCategory('favorite_verses')}
              >
                <Ionicons name="heart" size={16} color={selectedCategory === 'favorite_verses' ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563')} />
                <Text style={[styles.categorySelectorText, selectedCategory === 'favorite_verses' && styles.categorySelectorTextActive]}>
                  Versos
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.categorySelectorButton,
                  selectedCategory === 'devotionals' && styles.categorySelectorButtonActive,
                  { backgroundColor: selectedCategory === 'devotionals' ? '#8B5CF6' : (isDark ? '#374151' : '#F3F4F6') }
                ]}
                onPress={() => setSelectedCategory('devotionals')}
              >
                <Ionicons name="book" size={16} color={selectedCategory === 'devotionals' ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563')} />
                <Text style={[styles.categorySelectorText, selectedCategory === 'devotionals' && styles.categorySelectorTextActive]}>
                  Devocionais
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.categorySelectorButton,
                  selectedCategory === 'personal' && styles.categorySelectorButtonActive,
                  { backgroundColor: selectedCategory === 'personal' ? '#8B5CF6' : (isDark ? '#374151' : '#F3F4F6') }
                ]}
                onPress={() => setSelectedCategory('personal')}
              >
                <Ionicons name="create" size={16} color={selectedCategory === 'personal' ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563')} />
                <Text style={[styles.categorySelectorText, selectedCategory === 'personal' && styles.categorySelectorTextActive]}>
                  Pessoal
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Título</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#374151' : '#F3F4F6', color: isDark ? '#FFFFFF' : '#111827' }]}
              placeholder="Digite o título..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Conteúdo</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: isDark ? '#374151' : '#F3F4F6', color: isDark ? '#FFFFFF' : '#111827' }]}
              placeholder="Digite o conteúdo..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={saveNote}
              >
                <Text style={styles.modalButtonTextSave}>Salvar</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  categoriesScroll: {
    maxHeight: 60,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  notesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  noteDate: {
    fontSize: 12,
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  categorySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  categorySelectorButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  categorySelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  categorySelectorTextActive: {
    color: '#FFFFFF',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    height: 150,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalButtonSave: {
    backgroundColor: '#8B5CF6',
  },
  modalButtonTextCancel: {
    color: '#4B5563',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonTextSave: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
