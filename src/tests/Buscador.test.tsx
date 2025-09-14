// tests/Buscador.test.tsx
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Buscador from '../../components/Buscador';

describe('Buscador', () => {
  it('llama a onBuscar con query simple cuando tipo es title', () => {
  const mockOnBuscar = vi.fn();
  render(<Buscador onBuscar={mockOnBuscar} />);

  const input = screen.getByPlaceholderText('Buscar libro...');
  const select = screen.getByLabelText('Seleccionar tipo de búsqueda');
  const button = screen.getByRole('button', { name: '🔍' });

  fireEvent.change(select, { target: { value: 'title' } }); 
  fireEvent.change(input, { target: { value: 'Harry Potter' } });
  fireEvent.click(button);

  expect(mockOnBuscar).toHaveBeenCalledWith('Harry Potter');
});

  it('llama a onBuscar con prefijo inauthor: cuando tipo es author', () => {
    const mockOnBuscar = vi.fn();
    render(<Buscador onBuscar={mockOnBuscar} />);

    const input = screen.getByPlaceholderText('Buscar libro...');
    const select = screen.getByLabelText('Seleccionar tipo de búsqueda');
    const button = screen.getByRole('button', { name: '🔍' });

    fireEvent.change(select, { target: { value: 'author' } });
    fireEvent.change(input, { target: { value: 'Rowling' } });
    fireEvent.click(button);

    expect(mockOnBuscar).toHaveBeenCalledWith('inauthor:Rowling');
  });

  it('llama a onBuscar con prefijo isbn: cuando tipo es isbn', () => {
    const mockOnBuscar = vi.fn();
    render(<Buscador onBuscar={mockOnBuscar} />);

    const input = screen.getByPlaceholderText('Buscar libro...');
    const select = screen.getByLabelText('Seleccionar tipo de búsqueda');
    const button = screen.getByRole('button', { name: '🔍' });

    fireEvent.change(select, { target: { value: 'isbn' } });
    fireEvent.change(input, { target: { value: '1234567890' } });
    fireEvent.click(button);

    expect(mockOnBuscar).toHaveBeenCalledWith('isbn:1234567890');
  });

  it('maneja query vacía correctamente', () => {
  const mockOnBuscar = vi.fn();
  render(<Buscador onBuscar={mockOnBuscar} />);

  const select = screen.getByLabelText('Seleccionar tipo de búsqueda');
  const button = screen.getByRole('button', { name: '🔍' });

  fireEvent.change(select, { target: { value: 'title' } }); 
  fireEvent.click(button);

  expect(mockOnBuscar).toHaveBeenCalledWith(''); 
});
});
