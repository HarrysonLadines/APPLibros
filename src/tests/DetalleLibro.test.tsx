// tests/DetalleLibro.test.tsx
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import DetalleLibro from '../../components/DetalleLibro';
import { Libro } from '../types/libro';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock useRouter
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// MOCK fetchReseñas
vi.mock('../components/DetalleLibro', async () => {
  const actual = await vi.importActual('../components/DetalleLibro');
  return {
    ...actual,
    fetchReseñas: vi.fn().mockResolvedValue([]), // devuelve reseñas vacías
  };
});

const libroMock: Libro = {
  id: '1',
  volumeInfo: {
    title: 'Harry Potter',
    authors: ['J.K. Rowling'],
    publishedDate: '1997',
    pageCount: 500,
    categories: ['Fantasía', 'Aventura'],
    description: 'Un libro mágico.',
    imageLinks: { thumbnail: 'https://example.com/thumb.jpg' },
  },
};

describe('DetalleLibro', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('renderiza la información principal del libro', async () => {
    await act(async () => {
      render(<DetalleLibro libro={libroMock} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeDefined();
      expect(screen.getByText('J.K. Rowling')).toBeDefined();
      expect(screen.getByText('1997')).toBeDefined();
      expect(screen.getByText('500')).toBeDefined();
      expect(screen.getByText(/Fantasía/)).toBeDefined();
      expect(screen.getByText('Un libro mágico.')).toBeDefined();
    });
  });

  it('muestra la portada con next/image mockeado', async () => {
    await act(async () => {
      render(<DetalleLibro libro={libroMock} />);
    });

    await waitFor(() => {
      const img = screen.getByAltText('Harry Potter');
      expect(img).toHaveAttribute('src', 'https://example.com/thumb.jpg');
    });
  });

  it('botón regresar llama a router.push("/")', async () => {
    await act(async () => {
      render(<DetalleLibro libro={libroMock} />);
    });

    const button = screen.getByText('Regresar');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('renderiza reseñas vacías inicialmente', async () => {
    await act(async () => {
      render(<DetalleLibro libro={libroMock} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Reseñas')).toBeDefined();
    });
  });
});
