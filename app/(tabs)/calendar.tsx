import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';

interface DayRecord {
  date: string;
  hasReading: boolean;
  hasDevotion: boolean;
  hasPrayer: boolean;
}

export default function CalendarScreen() {
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    loadRecords();
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

  const saveRecords = async (newRecords: DayRecord[]) => {
    try {
      await AsyncStorage.setItem('calendarRecords', JSON.stringify(newRecords));
      setRecords(newRecords);
    } catch (error) {
      console.error('Error saving records:', error);
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

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentDate);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          🕊️ Verso Diário
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Progress Cards */}
        <View style={styles.progressCards}>
          <View style={[styles.progressCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <View style={styles.progressIconContainer}>
              <Ionicons name="flame" size={32} color="#F59E0B" />
            </View>
            <Text style={[styles.progressValue, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {streak}
            </Text>
            <Text style={[styles.progressLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Dias Consecutivos
            </Text>
          </View>

          <View style={[styles.progressCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <View style={styles.progressIconContainer}>
              <Ionicons name="checkmark-circle" size={32} color="#10B981" />
            </View>
            <Text style={[styles.progressValue, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {totalDays}
            </Text>
            <Text style={[styles.progressLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Total de Dias
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={[styles.calendarCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
            </TouchableOpacity>
            <Text style={[styles.monthTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
            </TouchableOpacity>
          </View>

          {/* Weekday Headers */}
          <View style={styles.weekdayHeaders}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <Text key={index} style={[styles.weekdayHeader, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
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
              const isCurrentDay = isToday(day);
              const hasActivity = record && (record.hasReading || record.hasDevotion || record.hasPrayer);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isCurrentDay && styles.todayCell,
                    hasActivity && styles.activeDayCell,
                    { borderColor: isCurrentDay ? '#8B5CF6' : (isDark ? '#374151' : '#E5E7EB') }
                  ]}
                  onPress={() => {}}
                >
                  <Text style={[
                    styles.dayNumber,
                    isCurrentDay && styles.todayNumber,
                    hasActivity && styles.activeDayNumber,
                    { color: isCurrentDay ? '#8B5CF6' : (hasActivity ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#374151')) }
                  ]}>
                    {day.getDate()}
                  </Text>
                  {record && (
                    <View style={styles.activityDots}>
                      {record.hasReading && <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />}
                      {record.hasDevotion && <View style={[styles.dot, { backgroundColor: '#8B5CF6' }]} />}
                      {record.hasPrayer && <View style={[styles.dot, { backgroundColor: '#10B981' }]} />}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={[styles.legendCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.legendTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Legenda
          </Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={[styles.legendText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                Leitura Bíblica
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={[styles.legendText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                Devocional
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                Oração
              </Text>
            </View>
          </View>
        </View>

        {/* Suggestions */}
        <View style={[styles.suggestionsCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <View style={styles.suggestionHeader}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
            <Text style={[styles.suggestionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Sugestão de Leitura
            </Text>
          </View>
          <Text style={[styles.suggestionText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            Que tal ler um capítulo de Salmos hoje? É uma ótima forma de começar o dia em comunhão com Deus.
          </Text>
          <TouchableOpacity style={styles.suggestionButton}>
            <Text style={styles.suggestionButtonText}>Ir para Salmos</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
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
    borderColor: '#E5E7EB',
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
    borderColor: '#E5E7EB',
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
  activeDayCell: {
    backgroundColor: '#8B5CF6',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  todayNumber: {
    fontWeight: 'bold',
  },
  activeDayNumber: {
    color: '#FFFFFF',
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
    borderColor: '#E5E7EB',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  legendItems: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
  },
  suggestionsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#8B5CF6',
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
});
