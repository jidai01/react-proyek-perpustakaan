/**
 * @file client.js
 * @description Konfigurasi dan interceptor HTTP client (Axios) untuk komunikasi ke backend.
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.8:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan Interseptor Request
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;