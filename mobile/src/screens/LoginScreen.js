import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';
import apiClient from '../api/client';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Harap isi semua kolom!');
      return;
    }

    setLoading(true);
    try {
      // Mengirim request login ke backend
      const response = await apiClient.post('/auth/login', { username, password });

      const { token, user } = response.data;

      // --- PERBAIKAN KRUSIAL: SIMPAN DATA SECARA TERSTRUKTUR ---
      // Simpan token untuk authentikasi API
      await AsyncStorage.setItem('token', token);

      // Simpan role secara spesifik (agar dibaca oleh AppNavigator & UsersScreen)
      await AsyncStorage.setItem('userRole', user.role.toLowerCase());

      // Simpan profile user lengkap
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert('Sukses', `Selamat datang kembali, ${user.username}!`);

      // Gunakan reset atau replace agar user tidak bisa kembali ke layar login dengan tombol back
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan pada server';
      Alert.alert('Gagal Masuk', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Landing')}
        >
          <Text style={styles.backButtonText}>← DASHBOARD</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Masuk</Text>
          <Text style={styles.subtitle}>Selamat datang kembali di PerpusKu</Text>
        </View>

        <View style={styles.form}>
          {/* Input Username */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>NAMA PENGGUNA</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={COLORS.gray}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Input Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>KATA SANDI</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={COLORS.gray}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tombol Login */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>MASUK SEKARANG</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Daftar Gratis</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, padding: 24 },
  backButton: { marginTop: 10, marginBottom: 40 },
  backButtonText: { fontSize: 10, fontWeight: '900', color: COLORS.gray, letterSpacing: 2 },
  header: { marginBottom: 40 },
  title: { fontSize: 40, fontWeight: '900', color: COLORS.dark, letterSpacing: -1 },
  subtitle: { fontSize: 14, color: COLORS.gray, marginTop: 8, fontWeight: '500' },
  form: { flex: 1 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 10, fontWeight: '900', color: COLORS.gray, letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 16, fontSize: 16, color: COLORS.dark, fontWeight: '600' },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 16 },
  passwordInput: { flex: 1, paddingHorizontal: 20, paddingVertical: 16, fontSize: 16, color: COLORS.dark, fontWeight: '600' },
  eyeIcon: { paddingHorizontal: 15 },
  loginButton: { backgroundColor: COLORS.dark, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  buttonDisabled: { backgroundColor: COLORS.gray, opacity: 0.6 },
  loginButtonText: { color: COLORS.white, fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: COLORS.gray, fontSize: 14, fontWeight: '500' },
  footerLink: { color: COLORS.primary, fontSize: 14, fontWeight: '900' },
});

export default LoginScreen;