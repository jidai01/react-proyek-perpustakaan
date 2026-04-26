import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';
import apiClient from '../api/client';

const UsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Default true saat inisialisasi
  const [userRole, setUserRole] = useState(null);

  // Ambil Role dan Data User secara berurutan
  const initScreen = async () => {
    setLoading(true);
    try {
      const role = await AsyncStorage.getItem('userRole');
      const normalizedRole = role ? role.toLowerCase() : 'user';
      setUserRole(normalizedRole);

      // Hanya tarik data jika admin
      if (normalizedRole === 'admin') {
        await ambilUsers();
      }
    } catch (e) {
      setUserRole('user');
    } finally {
      setLoading(false);
    }
  };

  const ambilUsers = async () => {
    try {
      const response = await apiClient.get('/users', {
        params: { limit: 100 }
      });
      setUsers(response.data.data);
    } catch (error) {
      if (error.response?.status === 403) {
        Alert.alert('Akses Ditolak', 'Anda tidak memiliki izin melihat data ini');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Gagal memuat data pengguna');
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initScreen();
    });
    return unsubscribe;
  }, [navigation]);

  const hapusUser = async (id, username) => {
    if (userRole !== 'admin') return;

    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus "${username}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus User',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/users/${id}`);
              Alert.alert('Berhasil', 'Pengguna telah dihapus');
              ambilUsers(); // Refresh list
            } catch (error) {
              const msg = error.response?.data?.message || 'Terjadi kesalahan';
              Alert.alert('Gagal', msg);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.username}>{item.username}</Text>
          <View style={[styles.roleBadge, item.role === 'admin' ? styles.roleAdmin : styles.roleUser]}>
            <Text style={[styles.roleText, { color: item.role === 'admin' ? '#1976D2' : '#666' }]}>
              {item.role.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('UserForm', { user: item })}
        >
          <MaterialCommunityIcons name="pencil-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Cegah admin menghapus dirinya sendiri berdasarkan ID atau Role */}
        {item.role !== 'admin' && (
          <TouchableOpacity
            style={[styles.actionBtn, { marginLeft: 8, backgroundColor: '#FFF5F5' }]}
            onPress={() => hapusUser(item.id, item.username)}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // State: Loading Awal
  if (loading && userRole === null) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // State: Bukan Admin
  if (userRole !== 'admin') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <MaterialCommunityIcons name="shield-lock" size={80} color={COLORS.error} />
        <Text style={styles.errorTitle}>Akses Terbatas</Text>
        <Text style={styles.errorText}>Fitur manajemen user hanya tersedia untuk Administrator.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>KEMBALI</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[COLORS.dark, '#1e1e21']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerSubtitle}>SISTEM MANAJEMEN</Text>
            <Text style={styles.headerTitle}>Daftar Pengguna</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('UserForm')}
          >
            <MaterialCommunityIcons name="account-plus" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onRefresh={ambilUsers}
          refreshing={loading}
          ListEmptyComponent={
            !loading && <Text style={styles.emptyText}>Tidak ada pengguna ditemukan.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { padding: 24, paddingTop: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerSubtitle: { color: COLORS.primary, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  headerTitle: { color: COLORS.white, fontSize: 28, fontWeight: '900', marginTop: 4 },
  addButton: { backgroundColor: COLORS.primary, width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  content: { flex: 1, paddingHorizontal: 20 },
  listContainer: { paddingTop: 20, paddingBottom: 120 },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#F0F2F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark },
  username: { fontSize: 16, fontWeight: '800', color: COLORS.dark },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  roleAdmin: { backgroundColor: '#E3F2FD' },
  roleUser: { backgroundColor: '#F5F5F5' },
  roleText: { fontSize: 10, fontWeight: '900' },
  cardActions: { flexDirection: 'row' },
  actionBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' },
  errorTitle: { fontSize: 24, fontWeight: '900', color: COLORS.dark, marginTop: 20 },
  errorText: { color: '#6B7280', textAlign: 'center', marginTop: 10, lineHeight: 20 },
  backBtn: { backgroundColor: COLORS.dark, paddingHorizontal: 40, paddingVertical: 15, borderRadius: 16, marginTop: 30 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#9CA3AF', fontWeight: '600' }
});

export default UsersScreen;