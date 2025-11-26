import { View, Text, ScrollView, TouchableOpacity, Switch, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';

export default function Settings() {
  const { userName, memberSince, profileImage, setProfileImage } = useUser();
  const { isDark, toggleTheme, isAutoTheme, setAutoTheme } = useTheme();
  const { isNotificationsEnabled, setNotificationsEnabled } = useNotifications();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await setProfileImage(result.assets[0].uri);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={styles.topBarText}>🕊️ Verso Diário</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color="#8B5CF6" />
              </View>
            )}
            <View style={styles.editIcon}>
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.userName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            {userName}
          </Text>
          <Text style={[styles.memberSince, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Membro desde {formatDate(memberSince)}
          </Text>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#D1D5DB' : '#374151' }]}>
            Preferências
          </Text>

          <View style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Ionicons name="moon" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Modo Escuro
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Ionicons name="time" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Tema Automático
            </Text>
            <Switch
              value={isAutoTheme}
              onValueChange={setAutoTheme}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Ionicons name="notifications" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Notificações
            </Text>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Ionicons name="alarm" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Alarmes
            </Text>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#D1D5DB' : '#374151' }]}>
            Redes Sociais
          </Text>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Ionicons name="logo-instagram" size={24} color="#E1306C" />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              Instagram
            </Text>
            <Ionicons name="open-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Ionicons name="logo-youtube" size={24} color="#FF0000" />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              YouTube
            </Text>
            <Ionicons name="open-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Ionicons name="logo-tiktok" size={24} color="#000000" />
            <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              TikTok
            </Text>
            <Ionicons name="open-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Inspirational Message */}
        <View style={[styles.messageBox, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.messageText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            "Que Deus continue abençoando sua jornada espiritual. Você não caminha sozinho!"
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
            Verso Diário v1.0.0
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
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  messageBox: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
  },
});
