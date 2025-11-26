import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { getTodayVerse } from '../data/verses';

export default function DevotionalView() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [verse, setVerse] = useState({ text: '', reference: '' });

  useEffect(() => {
    const todayVerse = getTodayVerse();
    setVerse(todayVerse);
  }, []);

  const devotional = {
    title: 'Caminhando com Fé',
    content: `A vida cristã é uma jornada que requer fé constante e confiança em Deus. Quando enfrentamos desafios, é fácil nos sentirmos sobrecarregados e questionar o caminho à nossa frente.

No entanto, o Senhor nos lembra através de Sua Palavra que Ele está sempre conosco. Cada passo que damos, cada decisão que tomamos, deve ser fundamentada na confiança de que Deus tem um plano perfeito para nossas vidas.

Hoje, reflita sobre como você tem depositado sua confiança em Deus. Você tem buscado a direção Dele em oração? Está disposto a seguir mesmo quando o caminho parece incerto? Lembre-se de que a fé não significa ausência de dúvidas, mas a escolha de confiar apesar delas.

Deus está trabalhando em sua vida, mesmo nos momentos que você não consegue ver. Permaneça firme, continue orando, e confie que Ele está guiando seus passos para algo maravilhoso.`,
    questions: [
      'Como posso fortalecer minha fé diariamente?',
      'Quais áreas da minha vida preciso entregar a Deus?',
      'De que forma posso demonstrar confiança em Deus hoje?'
    ],
    prayer: 'Senhor, obrigado por estar sempre ao meu lado. Ajuda-me a confiar em Ti em todas as circunstâncias. Fortalece minha fé e guia meus passos segundo a Tua vontade. Em nome de Jesus, amém.'
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          Devocional do Dia
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Verse */}
        <View style={[styles.verseCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.verseText, { color: isDark ? '#E5E7EB' : '#374151' }]}>
            "{verse.text}"
          </Text>
          <Text style={[styles.verseReference, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {verse.reference}
          </Text>
        </View>

        {/* Content */}
        <View style={[styles.contentCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            📖 {devotional.title}
          </Text>
          <Text style={[styles.content, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            {devotional.content}
          </Text>
        </View>

        {/* Questions */}
        <View style={[styles.questionsCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Perguntas para Reflexão
          </Text>
          {devotional.questions.map((question, index) => (
            <View key={index} style={styles.questionItem}>
              <Text style={styles.questionNumber}>{index + 1}</Text>
              <Text style={[styles.questionText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                {question}
              </Text>
            </View>
          ))}
        </View>

        {/* Prayer */}
        <View style={[styles.prayerCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Oração
          </Text>
          <Text style={[styles.prayerText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            {devotional.prayer}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  verseCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 14,
  },
  contentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  questionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    fontSize: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  prayerCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
  },
  prayerText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
