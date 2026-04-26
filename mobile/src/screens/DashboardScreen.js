/**
 * @file DashboardScreen.js
 * @description Komponen React Native untuk antarmuka layar mobile DashboardScreen.js.
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';
import apiClient from '../api/client';

const DashboardScreen = ({ navigation }) => {
  const [buku, setBuku] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user'); // State untuk role

  const ambilBuku = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      const response = await apiClient.get('/buku', {
        params: { cari: search, limit: 100 }
      });

      setBuku(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    const savedUser = await AsyncStorage.getItem('user');
    const savedRole = await AsyncStorage.getItem('userRole');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedRole) setUserRole(savedRole.toLowerCase());
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
      ambilBuku();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      ambilBuku();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const hapusBuku = (id, judul) => {
    // Proteksi tambahan di sisi client
    if (userRole !== 'admin') {
      Alert.alert('Akses Ditolak', 'Hanya admin yang dapat menghapus buku.');
      return;
    }

    Alert.alert(
      'Konfirmasi',
      `Hapus buku "${judul}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/buku/${id}`);
              Alert.alert('Berhasil', 'Buku telah dihapus');
              ambilBuku();
            } catch (error) {
              Alert.alert('Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>📖</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.judul}</Text>
        <Text style={styles.cardAuthor}>{item.penulis}</Text>
      </View>

      {/* ACTIONS HANYA UNTUK ADMIN */}
      {userRole === 'admin' && (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('BukuForm', { buku: item })}
          >
            <MaterialCommunityIcons name="pencil-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { marginLeft: 8 }]}
            onPress={() => hapusBuku(item.id, item.judul)}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[COLORS.dark, '#1e1e21']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerSubtitle}>HALO, {user?.username?.toUpperCase() || 'PENGGUNA'}</Text>
            <Text style={styles.headerTitle}>Katalog</Text>
          </View>

          {/* TOMBOL TAMBAH HANYA UNTUK ADMIN */}
          {userRole === 'admin' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('BukuForm')}
            >
              <MaterialCommunityIcons name="plus" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari buku atau penulis..."
              placeholderTextColor="#6B7280"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DAFTAR BUKU</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{buku.length} ITEM</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={buku}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContainer,
              { paddingBottom: 120 }
            ]}
            showsVerticalScrollIndicator={false}
            onRefresh={ambilBuku}
            refreshing={loading}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Tidak ada buku yang ditemukan.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 24, paddingTop: 10, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: COLORS.white, letterSpacing: -1 },
  headerSubtitle: { fontSize: 10, color: COLORS.primary, fontWeight: '900', letterSpacing: 2, marginBottom: 4 },
  addButton: { backgroundColor: COLORS.primary, width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  searchContainer: { marginBottom: 8 },
  searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  searchInput: { flex: 1, height: 52, color: COLORS.white, fontSize: 14, marginLeft: 10 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: '#6B7280', letterSpacing: 1.5 },
  countBadge: { backgroundColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  countText: { fontSize: 10, fontWeight: '900', color: COLORS.dark },
  listContainer: { paddingBottom: 20 },
  card: { backgroundColor: COLORS.white, padding: 16, borderRadius: 24, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  cardIcon: { width: 50, height: 50, borderRadius: 14, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardIconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: COLORS.dark, marginBottom: 2 },
  cardAuthor: { fontSize: 12, color: COLORS.gray, fontWeight: '600' },
  cardActions: { flexDirection: 'row' },
  actionBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  emptyText: { textAlign: 'center', marginTop: 50, color: COLORS.gray, fontWeight: '600' }
});

export default DashboardScreen;