'use client';

import { useEffect, useState } from 'react';
import TarjetaLibro from '../..//components/TarjetaLibro';
import Header from '../../components/Header';
import { buscarLibros } from './lib/apiGoogleBooks';
import { Libro } from '../../types/libro';

// Define the Libro type according to your data structure

export default function HomePage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [pagina, setPagina] = useState(0);
  const [queryActual, setQueryActual] = useState('');

  // Cargar tendencias al iniciar
  useEffect(() => {
    const cargarTendencias = async () => {
      const resultados = await buscarLibros('tendencias', 0, 20);
      setLibros(resultados);
      setQueryActual('tendencias');
    };
    cargarTendencias();
  }, []);

  const manejarBusqueda = async (query: string) => {
    setQueryActual(query);
    setPagina(0);
    const resultados = await buscarLibros(query, 0, 20);
    setLibros(resultados);
  };

  const cargarMas = async () => {
    const nuevaPagina = pagina + 20;
    const resultados = await buscarLibros(queryActual, nuevaPagina, 20);
    setLibros((prev) => [...prev, ...resultados]);
    setPagina(nuevaPagina);
  };

  return (
    <div className="min-h-screen bg-gray-">
      <Header onBuscar={manejarBusqueda} />
      <main className="max-w-6xl mx-auto p-4 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {libros.map((libro) => (
            <TarjetaLibro key={libro.id} libro={libro} />
          ))}
        </div>
        {libros.length > 0 && (
          <div className='flex justify-center mt-4'>
          <button onClick={cargarMas} className="mt-11 mb-10 px-4 py-2 bg-black text-white rounded">
            Cargar más
          </button>
          </div>
        )}
      </main>
    </div>
  );
}
