import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function Store() {
  const { isDark, themeColors } = useTheme();

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
    {
      id: 5,
      name: 'Kit Devocional',
      price: 'R$ 59,90',
      description: 'Caderno + Caneta + Marcadores',
      icon: 'gift',
    },
    {
      id: 6,
      name: 'Quadro Decorativo',
      price: 'R$ 79,90',
      description: 'Quadro com versículo bíblico',
      icon: 'image',
    },
  ];

  const openStore = () => {
    Linking.openURL('https://versodiario.com.br/loja');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <Text style={[styles.topBarText, { color: themeColors.headerText }]}>🕊️ Verso Diário</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Loja
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Produtos cristãos exclusivos
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Banner Principal */}
        <TouchableOpacity 
          style={[styles.banner, { backgroundColor: themeColors.primary }]}
          onPress={openStore}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconContainer}>
              <Ionicons name="sparkles" size={48} color="#FFFFFF" />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Novidades Exclusivas!</Text>
              <Text style={styles.bannerSubtitle}>
                Produtos que inspiram sua fé e fortalecem sua caminhada espiritual
              </Text>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>Frete Grátis acima de R$ 99</Text>
              </View>
            </View>
          </View>
          <View style={styles.bannerDecor}>
            <Ionicons name="heart" size={24} color="rgba(255,255,255,0.3)" />
            <Ionicons name="cross" size={28} color="rgba(255,255,255,0.3)" />
            <Ionicons name="book" size={24} color="rgba(255,255,255,0.3)" />
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Categorias
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesRow}>
              <TouchableOpacity style={[styles.categoryChip, { backgroundColor: themeColors.primary + '20' }]}>
                <Ionicons name="diamond" size={18} color={themeColors.primary} />
                <Text style={[styles.categoryChipText, { color: themeColors.primary }]}>Acessórios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.categoryChip, { backgroundColor: themeColors.primary + '20' }]}>
                <Ionicons name="shirt" size={18} color={themeColors.primary} />
                <Text style={[styles.categoryChipText, { color: themeColors.primary }]}>Vestuário</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.categoryChip, { backgroundColor: themeColors.primary + '20' }]}>
                <Ionicons name="book" size={18} color={themeColors.primary} />
                <Text style={[styles.categoryChipText, { color: themeColors.primary }]}>Bíblias</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.categoryChip, { backgroundColor: themeColors.primary + '20' }]}>
                <Ionicons name="home" size={18} color={themeColors.primary} />
                <Text style={[styles.categoryChipText, { color: themeColors.primary }]}>Decoração</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Products */}
        <View style={styles.productsSection}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Produtos em Destaque
          </Text>
          <View style={styles.productsList}>
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={[styles.productCard, { backgroundColor: themeColors.card }]}
                onPress={openStore}
              >
                <View style={[styles.productIcon, { backgroundColor: themeColors.primary + '15' }]}>
                  <Ionicons name={product.icon as any} size={28} color={themeColors.primary} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: themeColors.text }]}>
                    {product.name}
                  </Text>
                  <Text style={[styles.productDescription, { color: themeColors.textSecondary }]}>
                    {product.description}
                  </Text>
                  <Text style={[styles.productPrice, { color: themeColors.primary }]}>
                    {product.price}
                  </Text>
                </View>
                <TouchableOpacity style={[styles.buyButton, { backgroundColor: themeColors.primary }]}>
                  <Ionicons name="cart" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: themeColors.card }]}>
          <Ionicons name="shield-checkmark" size={24} color={themeColors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoTitle, { color: themeColors.text }]}>
              Compra 100% Segura
            </Text>
            <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
              Pagamento criptografado e entrega garantida em todo o Brasil
            </Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
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
  header: {
    padding: 20,
    paddingBottom: 12,
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
  banner: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  bannerDecor: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    gap: 8,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  productsSection: {
    marginBottom: 16,
  },
  productsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  productCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  productDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 14,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
