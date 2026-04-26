import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';
import apiClient from '../api/client';

const BukuFormScreen = ({ route, navigation }) => {
  const isEdit = route.params?.buku;
  const [judul, setJudul] = useState(isEdit ? isEdit.judul : '');
  const [penulis, setPenulis] = useState(isEdit ? isEdit.penulis : '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!judul || !penulis) {
      Alert.alert('Error', 'Harap isi judul dan penulis!');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const data = { judul, penulis };
      
      if (isEdit) {
        await apiClient.put(`/buku/${isEdit.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Alert.alert('Sukses', 'Data buku berhasil diperbarui');
      } else {
        await apiClient.post('/buku', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Alert.alert('Sukses', 'Buku baru berhasil ditambahkan');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Gagal', 'Terjadi kesalahan sistem');
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
            <Text style={styles.title}>{isEdit ? 'Edit Buku' : 'Tambah Buku'}</Text>
            <Text style={styles.subtitle}>Lengkapi informasi buku di bawah ini</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>JUDUL BUKU</Text>
              <TextInput 
                style={styles.input}
                placeholder="Masukkan judul buku"
                value={judul}
                onChangeText={setJudul}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>NAMA PENULIS</Text>
              <TextInput 
                style={styles.input}
                placeholder="Masukkan nama penulis"
                value={penulis}
                onChangeText={setPenulis}
              />
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
                  {loading ? 'MENYIMPAN...' : 'SIMPAN DATA'}
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
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
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

export default BukuFormScreen;
