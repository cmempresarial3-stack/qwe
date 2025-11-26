import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Image, StyleSheet, TextInput, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { useTheme, ThemeName } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';

const THEMES = [
  { id: 'default' as ThemeName, name: 'Padrão', color: '#8B5CF6', icon: 'sunny' },
  { id: 'dark' as ThemeName, name: 'Escuro', color: '#1F2937', icon: 'moon' },
  { id: 'pink' as ThemeName, name: 'Rosa', color: '#EC4899', icon: 'flower' },
  { id: 'yellow' as ThemeName, name: 'Amarelo', color: '#F59E0B', icon: 'sunny' },
];

export default function Settings() {
  const router = useRouter();
  const { userName, memberSince, profileImage, setProfileImage } = useUser();
  const { isDark, toggleTheme, isAutoTheme, setAutoTheme, themeName, setThemeName, themeColors } = useTheme();
  const { isNotificationsEnabled, setNotificationsEnabled } = useNotifications();
  
  const [feedback, setFeedback] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);

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

  const openSocialMedia = async (platform: string) => {
    let url = '';
    switch (platform) {
      case 'instagram':
        url = 'https://instagram.com/versodiario';
        break;
      case 'youtube':
        url = 'https://youtube.com/@versodiario';
        break;
      case 'tiktok':
        url = 'https://tiktok.com/@versodiario';
        break;
    }
    if (url) {
      await Linking.openURL(url);
    }
  };

  const sendFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Atenção', 'Por favor, escreva seu feedback antes de enviar.');
      return;
    }
    
    setSendingFeedback(true);
    
    try {
      const subject = encodeURIComponent('Feedback - Verso Diário App');
      const body = encodeURIComponent(`Feedback do usuário ${userName}:\n\n${feedback}`);
      const mailtoUrl = `mailto:cmempresarial3@gmail.com?subject=${subject}&body=${body}`;
      
      await Linking.openURL(mailtoUrl);
      
      setFeedback('');
      Alert.alert('Obrigado!', 'Seu feedback é muito importante para nós.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o feedback. Tente novamente.');
    } finally {
      setSendingFeedback(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <Text style={[styles.topBarText, { color: themeColors.headerText }]}>🕊️ Verso Diário</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: themeColors.card }]}>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: themeColors.primary + '20' }]}>
                <Ionicons name="person" size={40} color={themeColors.primary} />
              </View>
            )}
            <View style={[styles.editIcon, { backgroundColor: themeColors.primary }]}>
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.userName, { color: themeColors.text }]}>
            {userName}
          </Text>
          <Text style={[styles.memberSince, { color: themeColors.textSecondary }]}>
            Membro desde {formatDate(memberSince)}
          </Text>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
            Temas
          </Text>
          <View style={styles.themesGrid}>
            {THEMES.map(theme => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeItem,
                  { backgroundColor: themeColors.card },
                  themeName === theme.id && { borderColor: theme.color, borderWidth: 2 }
                ]}
                onPress={() => setThemeName(theme.id)}
              >
                <View style={[styles.themeColorDot, { backgroundColor: theme.color }]}>
                  <Ionicons name={theme.icon as any} size={16} color="#FFFFFF" />
                </View>
                <Text style={[styles.themeName, { color: themeColors.text }]}>
                  {theme.name}
                </Text>
                {themeName === theme.id && (
                  <Ionicons name="checkmark-circle" size={18} color={theme.color} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <Ionicons name="time" size={24} color={themeColors.text} />
            <Text style={[styles.settingText, { color: themeColors.text }]}>
              Tema Automático
            </Text>
            <Switch
              value={isAutoTheme}
              onValueChange={setAutoTheme}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
            Preferências
          </Text>

          <View style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <Ionicons name="notifications" size={24} color={themeColors.text} />
            <Text style={[styles.settingText, { color: themeColors.text }]}>
              Notificações
            </Text>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: themeColors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]}
            onPress={() => router.push('/alarms')}
          >
            <Ionicons name="alarm" size={24} color={themeColors.text} />
            <Text style={[styles.settingText, { color: themeColors.text }]}>
              Alarmes
            </Text>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
            Feedback
          </Text>
          
          <View style={[styles.feedbackCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.feedbackLabel, { color: themeColors.text }]}>
              Envie sua sugestão ou comentário
            </Text>
            <TextInput
              style={[styles.feedbackInput, { 
                backgroundColor: themeColors.background, 
                color: themeColors.text,
                borderColor: themeColors.border 
              }]}
              placeholder="Escreva seu feedback aqui..."
              placeholderTextColor={themeColors.textSecondary}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity 
              style={[styles.feedbackButton, { backgroundColor: themeColors.primary }]}
              onPress={sendFeedback}
              disabled={sendingFeedback}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
              <Text style={styles.feedbackButtonText}>
                {sendingFeedback ? 'Enviando...' : 'Enviar Feedback'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
            Redes Sociais
          </Text>

          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]}
            onPress={() => openSocialMedia('instagram')}
          >
            <Ionicons name="logo-instagram" size={24} color="#E1306C" />
            <Text style={[styles.settingText, { color: themeColors.text }]}>
              Instagram
            </Text>
            <Ionicons name="open-outline" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]}
            onPress={() => openSocialMedia('youtube')}
          >
            <Ionicons name="logo-youtube" size={24} color="#FF0000" />
            <Text style={[styles.settingText, { color: themeColors.text }]}>
              YouTube
            </Text>
            <Ionicons name="open-outline" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: themeColors.card }]}
            onPress={() => openSocialMedia('tiktok')}
          >
            <Ionicons name="logo-tiktok" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            <Text style={[styles.settingText, { color: themeColors.text }]}>
              TikTok
            </Text>
            <Ionicons name="open-outline" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Inspirational Message */}
        <View style={[styles.messageBox, { backgroundColor: themeColors.card, borderLeftColor: themeColors.primary }]}>
          <Text style={[styles.messageText, { color: themeColors.textSecondary }]}>
            "Que Deus continue abençoando sua jornada espiritual. Você não caminha sozinho!"
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
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
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  themeColorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  feedbackCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    marginBottom: 12,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  feedbackButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  messageBox: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
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
