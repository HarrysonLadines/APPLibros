'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Buscador({ onBuscar }: { onBuscar: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(query);
  };

  return (
    <div className="flex justify-center mt-2 mb-8 items-center space-x-4">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Image src="/globe.svg" alt="Logo" width={60} height={60} className="object-contain" />
      </div>

      {/* Buscador */}
      <form
        onSubmit={manejarSubmit}
        className="flex items-center max-w-md w-full bg-white shadow-md rounded-full overflow-hidden"
      >
        <input
          type="text"
          placeholder="Buscar libro..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 flex items-center justify-center transition-colors duration-200"
        >
          🔍
        </button>
      </form>
    </div>
  );
}
