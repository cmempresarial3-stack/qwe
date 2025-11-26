import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import * as Notifications from 'expo-notifications';

interface DayRecord {
  date: string;
  hasReading: boolean;
  hasDevotion: boolean;
  hasPrayer: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'reading' | 'prayer' | 'event' | 'reminder';
  hasNotification: boolean;
}

export default function CalendarScreen() {
  const { themeColors } = useTheme();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventType, setNewEventType] = useState<CalendarEvent['type']>('event');
  const [newEventNotification, setNewEventNotification] = useState(false);

  useEffect(() => {
    loadRecords();
    loadEvents();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [records]);

  const loadRecords = async () => {
    try {
      const stored = await AsyncStorage.getItem('calendarRecords');
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const stored = await AsyncStorage.getItem('calendarEvents');
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const saveRecords = async (newRecords: DayRecord[]) => {
    try {
      await AsyncStorage.setItem('calendarRecords', JSON.stringify(newRecords));
      setRecords(newRecords);
    } catch (error) {
      console.error('Error saving records:', error);
    }
  };

  const saveEvents = async (newEvents: CalendarEvent[]) => {
    try {
      await AsyncStorage.setItem('calendarEvents', JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const calculateProgress = () => {
    const total = records.filter(r => r.hasReading || r.hasDevotion || r.hasPrayer).length;
    setTotalDays(total);

    let currentStreak = 0;
    const today = new Date();
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const record of sortedRecords) {
      const recordDate = new Date(record.date);
      const diffDays = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === currentStreak && (record.hasReading || record.hasDevotion || record.hasPrayer)) {
        currentStreak++;
      } else if (diffDays > currentStreak) {
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const toggleActivity = async (date: string, activity: 'hasReading' | 'hasDevotion' | 'hasPrayer') => {
    const existingRecord = records.find(r => r.date === date);
    let updatedRecords: DayRecord[];

    if (existingRecord) {
      updatedRecords = records.map(r => 
        r.date === date ? { ...r, [activity]: !r[activity] } : r
      );
    } else {
      updatedRecords = [
        ...records,
        {
          date,
          hasReading: activity === 'hasReading',
          hasDevotion: activity === 'hasDevotion',
          hasPrayer: activity === 'hasPrayer',
        }
      ];
    }

    await saveRecords(updatedRecords);
  };

  const createEvent = async () => {
    if (!selectedDate || !newEventTitle.trim()) {
      Alert.alert('Atenção', 'Preencha o título do evento');
      return;
    }

    const dateStr = selectedDate.toISOString().split('T')[0];
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: newEventTitle.trim(),
      date: dateStr,
      time: newEventTime || undefined,
      type: newEventType,
      hasNotification: newEventNotification,
    };

    const updatedEvents = [...events, newEvent];
    await saveEvents(updatedEvents);

    if (newEventNotification && newEventTime) {
      await scheduleEventNotification(newEvent);
    }

    setNewEventTitle('');
    setNewEventTime('');
    setNewEventType('event');
    setNewEventNotification(false);
    setShowEventModal(false);
    Alert.alert('Sucesso', 'Evento criado!');
  };

  const scheduleEventNotification = async (event: CalendarEvent) => {
    try {
      const [hours, minutes] = (event.time || '08:00').split(':').map(Number);
      const eventDate = new Date(event.date);
      eventDate.setHours(hours, minutes, 0, 0);

      if (eventDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Lembrete',
            body: event.title,
            sound: true,
          },
          trigger: {
            date: eventDate,
          },
        });
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    await saveEvents(updatedEvents);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getRecordForDate = (date: Date): DayRecord | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return records.find(r => r.date === dateStr);
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const openDayModal = (date: Date) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'reading': return 'book';
      case 'prayer': return 'hand-right';
      case 'event': return 'calendar';
      case 'reminder': return 'alarm';
      default: return 'calendar';
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'reading': return '#3B82F6';
      case 'prayer': return '#10B981';
      case 'event': return '#8B5CF6';
      case 'reminder': return '#F59E0B';
      default: return '#8B5CF6';
    }
  };

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentDate);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <Text style={[styles.headerTitle, { color: themeColors.headerText }]}>
          🕊️ Verso Diário
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Progress Cards */}
        <View style={styles.progressCards}>
          <View style={[styles.progressCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.progressIconContainer}>
              <Ionicons name="flame" size={32} color="#F59E0B" />
            </View>
            <Text style={[styles.progressValue, { color: themeColors.text }]}>
              {streak}
            </Text>
            <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>
              Dias Consecutivos
            </Text>
          </View>

          <View style={[styles.progressCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.progressIconContainer}>
              <Ionicons name="checkmark-circle" size={32} color="#10B981" />
            </View>
            <Text style={[styles.progressValue, { color: themeColors.text }]}>
              {totalDays}
            </Text>
            <Text style={[styles.progressLabel, { color: themeColors.textSecondary }]}>
              Total de Dias
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={[styles.calendarCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.monthTitle, { color: themeColors.text }]}>
              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>

          {/* Weekday Headers */}
          <View style={styles.weekdayHeaders}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <Text key={index} style={[styles.weekdayHeader, { color: themeColors.textSecondary }]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              if (!day) {
                return <View key={`empty-${index}`} style={styles.emptyDay} />;
              }

              const record = getRecordForDate(day);
              const dayEvents = getEventsForDate(day);
              const isCurrentDay = isToday(day);
              const hasActivity = record && (record.hasReading || record.hasDevotion || record.hasPrayer);
              const hasEvents = dayEvents.length > 0;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isCurrentDay && styles.todayCell,
                    hasActivity && { backgroundColor: themeColors.primary },
                    { borderColor: isCurrentDay ? themeColors.primary : themeColors.border }
                  ]}
                  onPress={() => openDayModal(day)}
                >
                  <Text style={[
                    styles.dayNumber,
                    isCurrentDay && { color: themeColors.primary },
                    hasActivity && { color: '#FFFFFF' },
                    !isCurrentDay && !hasActivity && { color: themeColors.text }
                  ]}>
                    {day.getDate()}
                  </Text>
                  {(record || hasEvents) && (
                    <View style={styles.activityDots}>
                      {record?.hasReading && <View style={[styles.dot, { backgroundColor: hasActivity ? '#FFFFFF' : '#3B82F6' }]} />}
                      {record?.hasDevotion && <View style={[styles.dot, { backgroundColor: hasActivity ? '#FFFFFF' : '#8B5CF6' }]} />}
                      {record?.hasPrayer && <View style={[styles.dot, { backgroundColor: hasActivity ? '#FFFFFF' : '#10B981' }]} />}
                      {hasEvents && <View style={[styles.dot, { backgroundColor: hasActivity ? '#FFFFFF' : '#F59E0B' }]} />}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={[styles.legendCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <Text style={[styles.legendTitle, { color: themeColors.text }]}>
            Legenda
          </Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Leitura</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Devocional</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Oração</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Evento</Text>
            </View>
          </View>
        </View>

        {/* Suggestions */}
        <View style={[styles.suggestionsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.suggestionHeader}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
            <Text style={[styles.suggestionTitle, { color: themeColors.text }]}>
              Sugestão de Leitura
            </Text>
          </View>
          <Text style={[styles.suggestionText, { color: themeColors.textSecondary }]}>
            Que tal ler um capítulo de Salmos hoje? É uma ótima forma de começar o dia em comunhão com Deus.
          </Text>
          <TouchableOpacity 
            style={[styles.suggestionButton, { backgroundColor: themeColors.primary }]}
            onPress={() => router.push('/bible-reader?book=Salmos&chapter=1')}
          >
            <Text style={styles.suggestionButtonText}>Ir para Salmos</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Day Modal */}
      <Modal visible={showDayModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                {selectedDate?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
              </Text>
              <TouchableOpacity onPress={() => setShowDayModal(false)}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            {/* Activities */}
            <Text style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>
              Marcar Atividades
            </Text>
            <View style={styles.activitiesGrid}>
              {selectedDate && (() => {
                const dateStr = selectedDate.toISOString().split('T')[0];
                const record = records.find(r => r.date === dateStr);
                
                return (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.activityItem,
                        { backgroundColor: record?.hasReading ? '#3B82F6' : themeColors.background }
                      ]}
                      onPress={() => toggleActivity(dateStr, 'hasReading')}
                    >
                      <Ionicons name="book" size={24} color={record?.hasReading ? '#FFFFFF' : '#3B82F6'} />
                      <Text style={[styles.activityText, { color: record?.hasReading ? '#FFFFFF' : themeColors.text }]}>
                        Leitura
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.activityItem,
                        { backgroundColor: record?.hasDevotion ? '#8B5CF6' : themeColors.background }
                      ]}
                      onPress={() => toggleActivity(dateStr, 'hasDevotion')}
                    >
                      <Ionicons name="heart" size={24} color={record?.hasDevotion ? '#FFFFFF' : '#8B5CF6'} />
                      <Text style={[styles.activityText, { color: record?.hasDevotion ? '#FFFFFF' : themeColors.text }]}>
                        Devocional
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.activityItem,
                        { backgroundColor: record?.hasPrayer ? '#10B981' : themeColors.background }
                      ]}
                      onPress={() => toggleActivity(dateStr, 'hasPrayer')}
                    >
                      <Ionicons name="hand-right" size={24} color={record?.hasPrayer ? '#FFFFFF' : '#10B981'} />
                      <Text style={[styles.activityText, { color: record?.hasPrayer ? '#FFFFFF' : themeColors.text }]}>
                        Oração
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              })()}
            </View>

            {/* Events for this day */}
            {selectedDate && getEventsForDate(selectedDate).length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { color: themeColors.textSecondary, marginTop: 16 }]}>
                  Eventos
                </Text>
                {getEventsForDate(selectedDate).map(event => (
                  <View key={event.id} style={[styles.eventItem, { backgroundColor: themeColors.background }]}>
                    <Ionicons name={getEventTypeIcon(event.type) as any} size={20} color={getEventTypeColor(event.type)} />
                    <View style={styles.eventInfo}>
                      <Text style={[styles.eventTitle, { color: themeColors.text }]}>{event.title}</Text>
                      {event.time && (
                        <Text style={[styles.eventTime, { color: themeColors.textSecondary }]}>{event.time}</Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => deleteEvent(event.id)}>
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            <TouchableOpacity
              style={[styles.addEventButton, { backgroundColor: themeColors.primary }]}
              onPress={() => {
                setShowDayModal(false);
                setShowEventModal(true);
              }}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addEventButtonText}>Adicionar Evento</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Event Modal */}
      <Modal visible={showEventModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                Novo Evento
              </Text>
              <TouchableOpacity onPress={() => setShowEventModal(false)}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Título</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
              placeholder="Ex: Culto de domingo"
              placeholderTextColor={themeColors.textSecondary}
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />

            <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Horário (opcional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
              placeholder="Ex: 19:00"
              placeholderTextColor={themeColors.textSecondary}
              value={newEventTime}
              onChangeText={setNewEventTime}
            />

            <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Tipo</Text>
            <View style={styles.typeSelector}>
              {(['event', 'reading', 'prayer', 'reminder'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeItem,
                    { backgroundColor: newEventType === type ? getEventTypeColor(type) : themeColors.background }
                  ]}
                  onPress={() => setNewEventType(type)}
                >
                  <Ionicons 
                    name={getEventTypeIcon(type) as any} 
                    size={18} 
                    color={newEventType === type ? '#FFFFFF' : getEventTypeColor(type)} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.notificationToggle, { backgroundColor: themeColors.background }]}
              onPress={() => setNewEventNotification(!newEventNotification)}
            >
              <Ionicons 
                name={newEventNotification ? "notifications" : "notifications-outline"} 
                size={22} 
                color={newEventNotification ? themeColors.primary : themeColors.textSecondary} 
              />
              <Text style={[styles.notificationText, { color: themeColors.text }]}>
                Ativar lembrete
              </Text>
              <View style={[styles.checkbox, newEventNotification && { backgroundColor: themeColors.primary }]}>
                {newEventNotification && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: themeColors.primary }]}
              onPress={createEvent}
            >
              <Text style={styles.createButtonText}>Criar Evento</Text>
            </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  progressCards: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  progressCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  progressIconContainer: {
    marginBottom: 12,
  },
  progressValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  calendarCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekdayHeaders: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekdayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    margin: 1,
  },
  todayCell: {
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legendCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
  },
  suggestionsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  suggestionButton: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  activitiesGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  activityItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  activityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: 12,
    marginTop: 2,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  addEventButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  typeItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    gap: 12,
  },
  notificationText: {
    flex: 1,
    fontSize: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
