import React from 'react';
import { render } from '@testing-library/react-native';
import LandingScreen from '../src/screens/LandingScreen';
import { BackHandler, Alert } from 'react-native';

// Mocking dependencies
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('LandingScreen', () => {
  it('harus merender judul dan deskripsi dengan benar', () => {
    const { getByText, getAllByText } = render(<LandingScreen navigation={{ navigate: jest.fn() }} />);
    
    expect(getByText(/Jelajahi/i)).toBeTruthy();
    expect(getByText(/Dunia/i)).toBeTruthy();
    expect(getAllByText(/Tanpa Batas/i).length).toBeGreaterThan(0);
  });

  it('harus merender tombol aksi utama', () => {
    const { getByText } = render(<LandingScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByText('MULAI SEKARANG')).toBeTruthy();
    expect(getByText('EKSPLORASI KATALOG')).toBeTruthy();
  });
});
