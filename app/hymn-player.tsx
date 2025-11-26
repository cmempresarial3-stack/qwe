import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { useTheme } from '../contexts/ThemeContext';

const HYMNS_DATA: Record<number, { title: string; lyrics: string[] }> = {
  1: {
    title: "Chuvas de Bênçãos",
    lyrics: [
      "Chuvas de bênção teremos,",
      "Gotas ao redor, já temos nós;",
      "Mas as torrentes nos prometem,",
      "Chuvas de bênção, das chuvas é senhor.",
      "",
      "Coro:",
      "Chuvas de graça, chuvas mil;",
      "Eis o que esperamos, de Jesus, o Rei gentil.",
    ]
  },
  2: {
    title: "Saudai o Nome de Jesus",
    lyrics: [
      "Saudai o nome de Jesus,",
      "Arcanjos prostrai-vos;",
      "Ao Rei dos reis, dai louvor,",
      "Ao Rei dos reis, coroai-O.",
      "",
      "Coro:",
      "Oh, glorioso Rei, oh, glorioso Rei!",
      "Nós te coroamos, Rei dos reis e Senhor.",
    ]
  },
  3: {
    title: "Castelo Forte",
    lyrics: [
      "Castelo forte é o nosso Deus,",
      "Espada e bom escudo;",
      "Com seu poder defende os Seus",
      "Em todo o trance agudo.",
    ]
  },
  4: {
    title: "Vencendo Vem Jesus",
    lyrics: [
      "Vencendo vem Jesus,",
      "Vencendo vem Jesus,",
      "Quebrado já por Ele, ",
      "Poder das trevas luz!",
    ]
  },
  5: {
    title: "Vem, Pecador",
    lyrics: [
      "Vem a Cristo, ó pecador,",
      "Ele salvar-te pode;",
      "Só Jesus, o Salvador,",
      "Teu peso pode aliviar.",
      "",
      "Coro:",
      "Vem, pecador, vem te salvar,",
      "Cristo morreu pra te libertar;",
    ]
  },
  6: {
    title: "Paz Divina",
    lyrics: [
      "Paz divina eu tenho no coração,",
      "Paz que excede todo o entendimento;",
      "Paz que só Jesus pode dar.",
    ]
  },
  7: {
    title: "Mais Perto da Tua Cruz",
    lyrics: [
      "Mais perto quero estar,",
      "Meu Deus, de Ti!",
      "Inda que seja a dor",
      "Que me una a Ti.",
    ]
  },
  8: {
    title: "Olhai Pro Cordeiro de Deus",
    lyrics: [
      "Olhai pro Cordeiro de Deus,",
      "Oh, pecador, olhai e viverá!",
      "Olhai agora mesmo;",
      "Só olhai e viverá!",
    ]
  },
  9: {
    title: "Oração de Consagração",
    lyrics: [
      "Toma minha vida, ó Deus,",
      "E consagra-a a Ti, Senhor;",
      "Toma os meus momentos, Meu Jesus,",
      "E sejam sempre Teus.",
    ]
  },
  10: {
    title: "Grandioso és Tu",
    lyrics: [
      "Senhor, meu Deus, quando eu maravilhado,",
      "Contemplo a tua imensa criação,",
      "O céu, a terra, o mar e as criaturas,",
      "Que em todo o mundo habitação!",
    ]
  },
};

// Fallback for missing hymns
const getFallbackHymn = (number: number) => ({
  title: `Hino ${number}`,
  lyrics: [
    `Letra do Hino ${number} não disponível.`,
    "",
    "Este conteúdo será adicionado em breve.",
    "Harpa Cristã - Hinário Evangélico",
  ]
});

export default function HymnPlayerScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const hymnNumber = parseInt(params.number as string) || 1;
  const hymn = HYMNS_DATA[hymnNumber] || getFallbackHymn(hymnNumber);
  
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadAudio = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/gentle.wav'),
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const seekTo = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          Hino {hymnNumber}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Lyrics */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.hymnTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          {hymn.title}
        </Text>
        <Text style={[styles.hymnSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Harpa Cristã - Nº {hymnNumber}
        </Text>
        
        <View style={styles.lyricsContainer}>
          {hymn.lyrics.map((line, index) => (
            <Text
              key={index}
              style={[
                styles.lyricLine,
                { color: isDark ? '#E5E7EB' : '#1F2937' },
                line.startsWith('Coro:') && styles.chorusLine,
                line === '' && styles.emptyLine,
              ]}
            >
              {line}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* Player Controls */}
      <View style={[styles.playerContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={[styles.timeText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {formatTime(position)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={seekTo}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor={isDark ? '#374151' : '#E5E7EB'}
            thumbTintColor="#8B5CF6"
          />
          <Text style={[styles.timeText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {formatTime(duration)}
          </Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-skip-back" size={32} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: '#8B5CF6' }]}
            onPress={togglePlayPause}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={36}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-skip-forward" size={32} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <Text style={[styles.playerInfo, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
          Instrumental - Harpa Cristã
        </Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  hymnTitle: {
    fontSize: 28,
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
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
  },
  chorusLine: {
    fontStyle: 'italic',
    fontWeight: '600',
  },
  emptyLine: {
    height: 14,
  },
  playerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  slider: {
    flex: 1,
    marginHorizontal: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 16,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  playerInfo: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
