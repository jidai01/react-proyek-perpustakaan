import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../theme/colors';
import apiClient from '../api/client';

const UserFormScreen = ({ route, navigation }) => {
  const isEdit = route.params?.user;
  const [username, setUsername] = useState(isEdit ? isEdit.username : '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(isEdit ? isEdit.role : 'user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async () => {
    if (!username || (!isEdit && !password)) {
      Alert.alert('Error', 'Harap isi username dan password!');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const data = { username, role };
      if (password) data.password = password; // Hanya kirim password jika diisi (untuk edit)
      
      if (isEdit) {
        await apiClient.put(`/users/${isEdit.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Alert.alert('Sukses', 'Data pengguna berhasil diperbarui');
      } else {
        await apiClient.post('/users', data, { // Gunakan endpoint /users khusus admin
          headers: { Authorization: `Bearer ${token}` }
        });

        Alert.alert('Sukses', 'Pengguna baru berhasil ditambahkan');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem');
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← KEMBALI</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>{isEdit ? 'Edit User' : 'Tambah User'}</Text>
            <Text style={styles.subtitle}>Kelola hak akses pengguna PerpusKu</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>NAMA PENGGUNA</Text>
              <TextInput 
                style={styles.input}
                placeholder="Masukkan username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{isEdit ? 'KATA SANDI BARU (OPSIONAL)' : 'KATA SANDI'}</Text>
              <View style={styles.passwordWrapper}>
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
              <Text style={styles.label}>ROLE / PERAN</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity 
                  style={[styles.roleOption, role === 'user' && styles.roleActive]}
                  onPress={() => setRole('user')}
                >
                  <Text style={[styles.roleOptionText, role === 'user' && styles.roleActiveText]}>USER</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.roleOption, role === 'admin' && styles.roleActive]}
                  onPress={() => setRole('admin')}
                >
                  <Text style={[styles.roleOptionText, role === 'admin' && styles.roleActiveText]}>ADMIN</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              disabled={loading}
              onPress={handleSubmit}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={[COLORS.primary, '#0066FF']}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'MENYIMPAN...' : 'SIMPAN PENGGUNA'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.dark,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    fontWeight: '500',
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
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
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

  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.gray,
  },
  roleActiveText: {
    color: COLORS.primary,
  },
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    ...Platform.select({
      web: { boxShadow: `0px 10px 20px ${COLORS.primary}44` },
      ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 }
    })
  },
  submitButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default UserFormScreen;
