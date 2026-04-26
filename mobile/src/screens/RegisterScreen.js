/**
 * @file RegisterScreen.js
 * @description Komponen React Native untuk antarmuka layar mobile RegisterScreen.js.
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import apiClient from '../api/client';


const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    if (confirmPassword === '') {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'Harap isi semua kolom!');
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Error', 'Kata sandi tidak cocok!');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/register', { username, password });
      Alert.alert('Sukses', 'Akun berhasil dibuat! Silakan masuk.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Gagal', error.response?.data?.message || 'Terjadi kesalahan saat pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Landing')}
          >
            <Text style={styles.backButtonText}>← DASHBOARD</Text>
          </TouchableOpacity>


          <View style={styles.header}>
            <Text style={styles.title}>Daftar</Text>
            <Text style={styles.subtitle}>Bergabunglah dengan komunitas literasi digital terbesar</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>NAMA PENGGUNA</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>KATA SANDI</Text>
              <View style={[styles.passwordWrapper, !passwordsMatch && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={22} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>KONFIRMASI KATA SANDI</Text>
              <View style={[
                styles.passwordWrapper,
                !passwordsMatch && styles.inputError,
                passwordsMatch && confirmPassword !== '' && styles.inputSuccess
              ]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <MaterialCommunityIcons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
              {!passwordsMatch && (
                <Text style={styles.errorText}>Kata sandi tidak cocok!</Text>
              )}
            </View>


            <TouchableOpacity
              disabled={loading || !passwordsMatch}
              onPress={handleRegister}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={loading || !passwordsMatch ? [COLORS.gray, COLORS.gray] : [COLORS.primary, '#0066FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.registerButton}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'MEMPROSES...' : 'BUAT AKUN GRATIS'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Masuk Disini</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: 24,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  backButtonText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.gray,
    letterSpacing: 2,
  },
  header: {
    marginBottom: 35,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.dark,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    fontWeight: '500',
    lineHeight: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.gray,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '600',
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },

  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  inputSuccess: {
    borderColor: COLORS.success,
    backgroundColor: '#F0FFF4',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    marginLeft: 4,
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  registerButton: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '500',
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '900',
  },
});

export default RegisterScreen;
