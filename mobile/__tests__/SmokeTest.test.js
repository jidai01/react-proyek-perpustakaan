import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

const SimpleComponent = () => (
  <View>
    <Text>Test PerpusKu</Text>
  </View>
);

describe('Smoke Test', () => {
  it('harus merender komponen sederhana tanpa error', () => {
    const { getByText } = render(<SimpleComponent />);
    expect(getByText('Test PerpusKu')).toBeTruthy();
  });
});
