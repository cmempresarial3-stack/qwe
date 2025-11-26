import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../contexts/ThemeContext';

interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  message: string;
  sound: string;
  days: number[];
}

const SOUNDS = [
  { id: 'default', name: 'Padrão' },
  { id: 'bells', name: 'Sinos' },
  { id: 'chimes', name: 'Carrilhão' },
  { id: 'gentle', name: 'Suave' },
  { id: 'piano', name: 'Piano' },
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
  const { isDark } = useTheme();
  const router = useRouter();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [time, setTime] = useState('08:00');
  const [message, setMessage] = useState('');
  const [selectedSound, setSelectedSound] = useState('default');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    loadAlarms();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Você precisa permitir notificações para usar os alarmes!');
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

  const saveAlarms = async (newAlarms: Alarm[]) => {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(newAlarms));
      setAlarms(newAlarms);
    } catch (error) {
      console.error('Error saving alarms:', error);
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
          sound: alarm.sound !== 'default' ? `${alarm.sound}.wav` : undefined,
        },
        trigger: {
          weekday: day + 1,
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
    }
  };

  const saveAlarm = async () => {
    if (!time || !message.trim()) {
      alert('Preencha todos os campos!');
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
      setSelectedSound('default');
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
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          Alarmes
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {alarms.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="alarm-outline" size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
            <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Nenhum alarme configurado
            </Text>
            <Text style={[styles.emptySubtext, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
              Toque no botão + para criar seu primeiro alarme
            </Text>
          </View>
        ) : (
          alarms.map(alarm => (
            <View key={alarm.id} style={[styles.alarmCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
              <View style={styles.alarmHeader}>
                <View style={styles.alarmTimeContainer}>
                  <Text style={[styles.alarmTime, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                    {alarm.time}
                  </Text>
                  <Text style={[styles.alarmDays, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    {formatDays(alarm.days)}
                  </Text>
                </View>
                <Switch
                  value={alarm.enabled}
                  onValueChange={() => toggleAlarm(alarm.id)}
                  trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
                  thumbColor={alarm.enabled ? '#8B5CF6' : '#F3F4F6'}
                />
              </View>
              
              <Text style={[styles.alarmMessage, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                {alarm.message}
              </Text>
              
              <View style={styles.alarmFooter}>
                <View style={styles.alarmSound}>
                  <Ionicons name="musical-notes" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text style={[styles.alarmSoundText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    {SOUNDS.find(s => s.id === alarm.sound)?.name || 'Padrão'}
                  </Text>
                </View>
                
                <View style={styles.alarmActions}>
                  <TouchableOpacity onPress={() => openModal(alarm)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteAlarm(alarm.id)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
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
          <ScrollView style={[styles.modalContent, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {editingAlarm ? 'Editar Alarme' : 'Novo Alarme'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Horário</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#374151' : '#F3F4F6', color: isDark ? '#FFFFFF' : '#111827' }]}
              placeholder="08:00"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={time}
              onChangeText={setTime}
            />

            <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Mensagem</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: isDark ? '#374151' : '#F3F4F6', color: isDark ? '#FFFFFF' : '#111827' }]}
              placeholder="Exemplo: Oi! Já orou hoje?"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Som</Text>
            <View style={styles.soundSelector}>
              {SOUNDS.map(sound => (
                <TouchableOpacity
                  key={sound.id}
                  style={[
                    styles.soundButton,
                    selectedSound === sound.id && styles.soundButtonActive,
                    { backgroundColor: selectedSound === sound.id ? '#8B5CF6' : (isDark ? '#374151' : '#F3F4F6') }
                  ]}
                  onPress={() => setSelectedSound(sound.id)}
                >
                  <Text style={[
                    styles.soundButtonText,
                    selectedSound === sound.id && styles.soundButtonTextActive,
                    { color: selectedSound === sound.id ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563') }
                  ]}>
                    {sound.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>Repetir</Text>
            <View style={styles.daysSelector}>
              {DAYS.map(day => (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day.id) && styles.dayButtonActive,
                    { backgroundColor: selectedDays.includes(day.id) ? '#8B5CF6' : (isDark ? '#374151' : '#F3F4F6') }
                  ]}
                  onPress={() => toggleDay(day.id)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    selectedDays.includes(day.id) && styles.dayButtonTextActive,
                    { color: selectedDays.includes(day.id) ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563') }
                  ]}>
                    {day.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
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
    padding: 16,
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
  alarmCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alarmDays: {
    fontSize: 14,
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
    fontSize: 14,
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
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  soundButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  soundButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  soundButtonTextActive: {
    color: '#FFFFFF',
  },
  daysSelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dayButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
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
