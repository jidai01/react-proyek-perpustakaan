import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Landing from '../pages/Landing';

describe('Landing Component', () => {
  it('harus merender judul Landing dengan benar', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
    
    // Periksa apakah teks yang merupakan bagian dari Landing dirender
    expect(screen.getByText(/Jelajahi/i)).toBeDefined();
    expect(screen.getByText(/Dunia/i)).toBeDefined();
    expect(screen.getByText(/Eksplorasi Katalog/i)).toBeDefined();
  });
});
