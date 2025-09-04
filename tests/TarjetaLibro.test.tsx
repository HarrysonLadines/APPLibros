import { render, screen } from '@testing-library/react';
import TarjetaLibro from '../components/TarjetaLibro';
import React from 'react';

// mocks.ts
export const libroMock = {
  id: '123',
  volumeInfo: {
    title: 'Libro de prueba',
    imageLinks: {
      extraLarge: 'https://example.com/image-extra-large.jpg',
    },
  },
};

export const libroSinImagen = {
  id: '456',
  volumeInfo: {
    title: 'Libro sin imagen',
    imageLinks: undefined,
  },
};

export const libroSinTitulo = {
  id: '789',
  volumeInfo: {
    title: '',
    imageLinks: undefined,
  },
};


test('renderiza el título correctamente', () => {
  render(<TarjetaLibro libro={libroMock} />);
  expect(screen.getByText(libroMock.volumeInfo.title)).toBeInTheDocument();
});

test('usa la imagen extraLarge y cambia http a https', () => {
  render(<TarjetaLibro libro={libroMock} />);
  const imagen = screen.getByRole('img') as HTMLImageElement;
  expect(imagen.src).toContain('image-extra-large.jpg');
});
