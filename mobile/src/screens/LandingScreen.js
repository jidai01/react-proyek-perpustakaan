// Updated: 2026-04-26
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

// Import Logo SVG
// Path: keluar dari screens (..) -> keluar dari src (..) -> assets
import LogoSvg from '../../assets/logo.svg';

const { width } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background Glows untuk kesan Modern/Futuristik */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER SECTION DENGAN LOGO SVG */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              {/* Menggunakan LogoSvg dengan ukuran proporsional */}
              <LogoSvg width={28} height={28} />
            </View>
            <Text style={styles.logoText}>
              Perpus<Text style={{ color: COLORS.primary }}>Ku</Text>
            </Text>
          </View>
        </View>

        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[COLORS.dark, '#2A2A2E']}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>✨ THE NEXT GEN LIBRARY</Text>
          </LinearGradient>

          <Text style={styles.title}>
            Jelajahi{'\n'}
            <Text style={{ color: COLORS.primary }}>Dunia</Text>{'\n'}
            Tanpa Batas.
          </Text>

          <Text style={styles.description}>
            Langkah pertama menuju pengetahuan tanpa batas. Kelola koleksi buku Anda dengan cara yang elegan, cepat, dan modern.
          </Text>

          {/* ACTION BUTTONS */}
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate('Register')}
          >
            <LinearGradient
              colors={[COLORS.primary, '#0066FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>MULAI SEKARANG</Text>
              <Text style={styles.buttonIcon}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>EKSPLORASI KATALOG</Text>
          </TouchableOpacity>
        </View>

        {/* STATS SECTION */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>30k+</Text>
            <Text style={styles.statLabel}>BUKU</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>10k+</Text>
            <Text style={styles.statLabel}>PEMBACA</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.9/5</Text>
            <Text style={styles.statLabel}>RATING</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 PerpusKu Digital System</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    backgroundColor: COLORS.primary,
    borderRadius: 150,
    opacity: 0.1,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 250,
    height: 250,
    backgroundColor: '#60A5FA',
    borderRadius: 125,
    opacity: 0.1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.dark,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.dark,
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: width > 400 ? 64 : 52, // Responsif untuk layar kecil
    fontWeight: '900',
    color: COLORS.dark,
    lineHeight: width > 400 ? 60 : 50,
    letterSpacing: -2.5,
    marginBottom: 20,
  },
  description: {
    fontSize: 17,
    color: COLORS.gray,
    lineHeight: 24,
    marginBottom: 40,
    fontWeight: '500',
  },
  buttonWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: { elevation: 8 },
    }),
  },
  primaryButton: {
    paddingVertical: 22,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  buttonIcon: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  secondaryButtonText: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
    borderTopWidth: 1.5,
    borderTopColor: '#F3F4F6',
    marginTop: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1.5,
    height: 30,
    backgroundColor: '#F3F4F6',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.dark,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.gray,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  footer: {
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 0 : 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#D1D5DB',
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});

export default LandingScreen;