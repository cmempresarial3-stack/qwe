import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../contexts/ThemeContext';
import { Audio } from 'expo-av';

interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  message: string;
  sound: string;
  days: number[];
}

interface PresetAlarm {
  enabled: boolean;
  time: string;
  soundId: string;
}

const SOUNDS = [
  { id: 'gentle', name: 'Suave' },
  { id: 'morning', name: 'Manhã' },
  { id: 'peaceful', name: 'Pacífico' },
  { id: 'worship', name: 'Adoração' },
  { id: 'nature', name: 'Natureza' },
];

const DAYS = [
  { id: 0, name: 'Dom', fullName: 'Domingo' },
  { id: 1, name: 'Seg', fullName: 'Segunda' },
  { id: 2, name: 'Ter', fullName: 'Terça' },
  { id: 3, name: 'Qua', fullName: 'Quarta' },
  { id: 4, name: 'Qui', fullName: 'Quinta' },
  { id: 5, name: 'Sex', fullName: 'Sexta' },
  { id: 6, name: 'Sáb', fullName: 'Sábado' },
];

export default function AlarmsScreen() {
  const { themeColors } = useTheme();
  const router = useRouter();
  
  const [morningAlarm, setMorningAlarm] = useState<PresetAlarm>({
    enabled: false,
    time: '07:00',
    soundId: 'morning',
  });
  
  const [nightAlarm, setNightAlarm] = useState<PresetAlarm>({
    enabled: false,
    time: '21:00',
    soundId: 'peaceful',
  });
  
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [time, setTime] = useState('08:00');
  const [message, setMessage] = useState('');
  const [selectedSound, setSelectedSound] = useState('gentle');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [testingSound, setTestingSound] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadAlarms();
    loadPresetAlarms();
    requestPermissions();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Para receber lembretes, é necessário permitir notificações.'
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const loadAlarms = async () => {
    try {
      const stored = await AsyncStorage.getItem('alarms');
      if (stored) {
        setAlarms(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading alarms:', error);
    }
  };

  const loadPresetAlarms = async () => {
    try {
      const morningStored = await AsyncStorage.getItem('morningPresetAlarm');
      const nightStored = await AsyncStorage.getItem('nightPresetAlarm');
      
      if (morningStored) setMorningAlarm(JSON.parse(morningStored));
      if (nightStored) setNightAlarm(JSON.parse(nightStored));
    } catch (error) {
      console.error('Error loading preset alarms:', error);
    }
  };

  const saveAlarms = async (newAlarms: Alarm[]) => {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(newAlarms));
      setAlarms(newAlarms);
    } catch (error) {
      console.error('Error saving alarms:', error);
    }
  };

  const savePresetAlarm = async (type: 'morning' | 'night', config: PresetAlarm) => {
    try {
      await AsyncStorage.setItem(`${type}PresetAlarm`, JSON.stringify(config));
      
      if (config.enabled) {
        await schedulePresetNotification(type, config);
      } else {
        await cancelPresetNotification(type);
      }
    } catch (error) {
      console.error('Error saving preset alarm:', error);
    }
  };

  const schedulePresetNotification = async (type: 'morning' | 'night', config: PresetAlarm) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(`preset-${type}`);
      
      const [hours, minutes] = config.time.split(':').map(Number);
      
      const title = type === 'morning' ? 'Bom dia! ☀️' : 'Boa noite! 🌙';
      const body = type === 'morning' 
        ? 'Que tal começar o dia lendo o verso diário?'
        : 'Hora de um momento de reflexão antes de dormir.';
      
      await Notifications.scheduleNotificationAsync({
        identifier: `preset-${type}`,
        content: {
          title,
          body,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        },
      });
    } catch (error) {
      console.error('Error scheduling preset notification:', error);
    }
  };

  const cancelPresetNotification = async (type: 'morning' | 'night') => {
    try {
      await Notifications.cancelScheduledNotificationAsync(`preset-${type}`);
    } catch (error) {
      console.error('Error canceling preset notification:', error);
    }
  };

  const togglePresetAlarm = async (type: 'morning' | 'night') => {
    if (type === 'morning') {
      const newConfig = { ...morningAlarm, enabled: !morningAlarm.enabled };
      setMorningAlarm(newConfig);
      await savePresetAlarm('morning', newConfig);
    } else {
      const newConfig = { ...nightAlarm, enabled: !nightAlarm.enabled };
      setNightAlarm(newConfig);
      await savePresetAlarm('night', newConfig);
    }
  };

  const updatePresetTime = async (type: 'morning' | 'night', newTime: string) => {
    if (type === 'morning') {
      const newConfig = { ...morningAlarm, time: newTime };
      setMorningAlarm(newConfig);
      await savePresetAlarm('morning', newConfig);
    } else {
      const newConfig = { ...nightAlarm, time: newTime };
      setNightAlarm(newConfig);
      await savePresetAlarm('night', newConfig);
    }
  };

  const testSound = async (soundId: string) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      
      if (testingSound === soundId) {
        setTestingSound(null);
        setSound(null);
        return;
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/gentle.wav'),
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setTestingSound(soundId);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setTestingSound(null);
        }
      });
    } catch (error) {
      console.error('Error testing sound:', error);
    }
  };

  const scheduleNotifications = async (alarm: Alarm) => {
    if (!alarm.enabled) return;

    const [hours, minutes] = alarm.time.split(':').map(Number);

    for (const day of alarm.days) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🕊️ Verso Diário',
          body: alarm.message,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: day + 1,
          hour: hours,
          minute: minutes,
        },
      });
    }
  };

  const saveAlarm = async () => {
    if (!time || !message.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    const newAlarm: Alarm = {
      id: editingAlarm?.id || Date.now().toString(),
      time,
      enabled: true,
      message: message.trim(),
      sound: selectedSound,
      days: selectedDays,
    };

    const updatedAlarms = editingAlarm
      ? alarms.map(a => a.id === editingAlarm.id ? newAlarm : a)
      : [...alarms, newAlarm];

    await saveAlarms(updatedAlarms);
    await scheduleNotifications(newAlarm);
    closeModal();
  };

  const toggleAlarm = async (id: string) => {
    const updatedAlarms = alarms.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    await saveAlarms(updatedAlarms);

    const alarm = updatedAlarms.find(a => a.id === id);
    if (alarm) {
      if (alarm.enabled) {
        await scheduleNotifications(alarm);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        updatedAlarms.filter(a => a.enabled && a.id !== id).forEach(a => {
          scheduleNotifications(a);
        });
      }
    }
  };

  const deleteAlarm = async (id: string) => {
    const updatedAlarms = alarms.filter(a => a.id !== id);
    await saveAlarms(updatedAlarms);
    await Notifications.cancelAllScheduledNotificationsAsync();
    updatedAlarms.filter(a => a.enabled).forEach(a => {
      scheduleNotifications(a);
    });
  };

  const openModal = (alarm?: Alarm) => {
    if (alarm) {
      setEditingAlarm(alarm);
      setTime(alarm.time);
      setMessage(alarm.message);
      setSelectedSound(alarm.sound);
      setSelectedDays(alarm.days);
    } else {
      setEditingAlarm(null);
      setTime('08:00');
      setMessage('');
      setSelectedSound('gentle');
      setSelectedDays([1, 2, 3, 4, 5]);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingAlarm(null);
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const formatDays = (days: number[]) => {
    if (days.length === 7) return 'Todos os dias';
    if (days.length === 0) return 'Nunca';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Dias úteis';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Finais de semana';
    return days.map(d => DAYS[d].name).join(', ');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          Alarmes
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Preset Alarms */}
        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
          Alarmes Rápidos
        </Text>

        {/* Morning Alarm */}
        <View style={[styles.presetCard, { backgroundColor: themeColors.card }]}>
          <View style={styles.presetHeader}>
            <View style={[styles.presetIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="sunny" size={28} color="#F59E0B" />
            </View>
            <View style={styles.presetInfo}>
              <Text style={[styles.presetTitle, { color: themeColors.text }]}>
                Alarme da Manhã
              </Text>
              <Text style={[styles.presetSubtitle, { color: themeColors.textSecondary }]}>
                Comece o dia com a Palavra
              </Text>
            </View>
            <Switch
              value={morningAlarm.enabled}
              onValueChange={() => togglePresetAlarm('morning')}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.presetTimeRow}>
            <Ionicons name="time-outline" size={20} color={themeColors.textSecondary} />
            <TextInput
              style={[styles.timeInput, { color: themeColors.text, borderColor: themeColors.border }]}
              value={morningAlarm.time}
              onChangeText={(text) => updatePresetTime('morning', text)}
              placeholder="07:00"
              placeholderTextColor={themeColors.textSecondary}
            />
          </View>
        </View>

        {/* Night Alarm */}
        <View style={[styles.presetCard, { backgroundColor: themeColors.card }]}>
          <View style={styles.presetHeader}>
            <View style={[styles.presetIcon, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="moon" size={28} color="#6366F1" />
            </View>
            <View style={styles.presetInfo}>
              <Text style={[styles.presetTitle, { color: themeColors.text }]}>
                Alarme da Noite
              </Text>
              <Text style={[styles.presetSubtitle, { color: themeColors.textSecondary }]}>
                Reflexão antes de dormir
              </Text>
            </View>
            <Switch
              value={nightAlarm.enabled}
              onValueChange={() => togglePresetAlarm('night')}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.presetTimeRow}>
            <Ionicons name="time-outline" size={20} color={themeColors.textSecondary} />
            <TextInput
              style={[styles.timeInput, { color: themeColors.text, borderColor: themeColors.border }]}
              value={nightAlarm.time}
              onChangeText={(text) => updatePresetTime('night', text)}
              placeholder="21:00"
              placeholderTextColor={themeColors.textSecondary}
            />
          </View>
        </View>

        {/* Custom Alarms */}
        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary, marginTop: 20 }]}>
          Alarmes Personalizados
        </Text>

        {alarms.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="alarm-outline" size={48} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              Nenhum alarme personalizado
            </Text>
            <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
              Toque no + para criar
            </Text>
          </View>
        ) : (
          alarms.map(alarm => (
            <View key={alarm.id} style={[styles.alarmCard, { backgroundColor: themeColors.card }]}>
              <View style={styles.alarmHeader}>
                <View style={styles.alarmTimeContainer}>
                  <Text style={[styles.alarmTime, { color: themeColors.text }]}>
                    {alarm.time}
                  </Text>
                  <Text style={[styles.alarmDays, { color: themeColors.textSecondary }]}>
                    {formatDays(alarm.days)}
                  </Text>
                </View>
                <Switch
                  value={alarm.enabled}
                  onValueChange={() => toggleAlarm(alarm.id)}
                  trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <Text style={[styles.alarmMessage, { color: themeColors.textSecondary }]}>
                {alarm.message}
              </Text>
              
              <View style={styles.alarmFooter}>
                <View style={styles.alarmSound}>
                  <Ionicons name="musical-notes" size={16} color={themeColors.textSecondary} />
                  <Text style={[styles.alarmSoundText, { color: themeColors.textSecondary }]}>
                    {SOUNDS.find(s => s.id === alarm.sound)?.name || 'Padrão'}
                  </Text>
                </View>
                
                <View style={styles.alarmActions}>
                  <TouchableOpacity onPress={() => openModal(alarm)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={20} color={themeColors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteAlarm(alarm.id)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: themeColors.primary }]} onPress={() => openModal()}>
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
          <ScrollView style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                {editingAlarm ? 'Editar Alarme' : 'Novo Alarme'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Horário</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.background, color: themeColors.text }]}
              placeholder="08:00"
              placeholderTextColor={themeColors.textSecondary}
              value={time}
              onChangeText={setTime}
            />

            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Mensagem</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: themeColors.background, color: themeColors.text }]}
              placeholder="Exemplo: Oi! Já orou hoje?"
              placeholderTextColor={themeColors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Som</Text>
            <View style={styles.soundSelector}>
              {SOUNDS.map(s => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.soundButton,
                    { backgroundColor: selectedSound === s.id ? themeColors.primary : themeColors.background }
                  ]}
                  onPress={() => setSelectedSound(s.id)}
                >
                  <Text style={[
                    styles.soundButtonText,
                    { color: selectedSound === s.id ? '#FFFFFF' : themeColors.text }
                  ]}>
                    {s.name}
                  </Text>
                  <TouchableOpacity onPress={() => testSound(s.id)} style={styles.testBtn}>
                    <Ionicons 
                      name={testingSound === s.id ? "stop" : "play"} 
                      size={16} 
                      color={selectedSound === s.id ? '#FFFFFF' : themeColors.primary} 
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Repetir</Text>
            <View style={styles.daysSelector}>
              {DAYS.map(day => (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.dayButton,
                    { backgroundColor: selectedDays.includes(day.id) ? themeColors.primary : themeColors.background }
                  ]}
                  onPress={() => toggleDay(day.id)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    { color: selectedDays.includes(day.id) ? '#FFFFFF' : themeColors.text }
                  ]}>
                    {day.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: themeColors.background }]}
                onPress={closeModal}
              >
                <Text style={[styles.modalButtonTextCancel, { color: themeColors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: themeColors.primary }]}
                onPress={saveAlarm}
              >
                <Text style={styles.modalButtonTextSave}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  presetCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  presetIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  presetInfo: {
    flex: 1,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  presetSubtitle: {
    fontSize: 13,
  },
  presetTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  alarmCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alarmTimeContainer: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alarmDays: {
    fontSize: 13,
  },
  alarmMessage: {
    fontSize: 14,
    marginBottom: 12,
  },
  alarmFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alarmSound: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alarmSoundText: {
    fontSize: 13,
  },
  alarmActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
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
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
  },
  soundSelector: {
    gap: 8,
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  soundButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  testBtn: {
    padding: 4,
  },
  daysSelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  dayButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dayButtonText: {
    fontSize: 13,
    fontWeight: '600',
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
  modalButtonTextCancel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonTextSave: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
