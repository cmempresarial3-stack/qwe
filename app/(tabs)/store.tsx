import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function Store() {
  const { isDark } = useTheme();

  const products = [
    {
      id: 1,
      name: 'Pulseira QR/NFC',
      price: 'R$ 29,90',
      description: 'Pulseira inteligente com verso do dia',
      icon: 'watch',
    },
    {
      id: 2,
      name: 'Camiseta Verso Diário',
      price: 'R$ 49,90',
      description: 'Camiseta 100% algodão com design exclusivo',
      icon: 'shirt',
    },
    {
      id: 3,
      name: 'Caneca Verso Diário',
      price: 'R$ 34,90',
      description: 'Caneca de porcelana 300ml',
      icon: 'cafe',
    },
    {
      id: 4,
      name: 'Bíblia ACF',
      price: 'R$ 89,90',
      description: 'Bíblia Almeida Corrigida Fiel',
      icon: 'book',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={styles.topBarText}>🕊️ Verso Diário</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          Loja
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Produtos cristãos exclusivos
        </Text>
      </View>

      {/* Products */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.productsList}>
          {products.map((product) => (
            <View
              key={product.id}
              style={[styles.productCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
            >
              <View style={styles.productIcon}>
                <Ionicons name={product.icon as any} size={32} color="#8B5CF6" />
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {product.name}
                </Text>
                <Text style={[styles.productDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {product.description}
                </Text>
                <Text style={[styles.productPrice, { color: '#8B5CF6' }]}>
                  {product.price}
                </Text>
              </View>
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Comprar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Ionicons name="information-circle" size={24} color="#8B5CF6" />
          <Text style={[styles.infoText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            Ao clicar em "Comprar", você será redirecionado para nossa plataforma de pagamento seguro.
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
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  productsList: {
    paddingHorizontal: 16,
  },
  productCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
