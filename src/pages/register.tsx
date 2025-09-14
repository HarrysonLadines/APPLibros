import { useState } from 'react';
import { useRouter } from 'next/router';
import HeaderAuth from '../../components/HeaderAuth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, nombre }),
    });

    if (res.ok) {
      // Redirigir al login después del registro exitoso
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Error desconocido');
    }
  };

  return (
    <div className="min-h-screen bg-black-400">
      {/* Header estático que no se desplaza */}
      <HeaderAuth />

      {/* Contenedor para centrar el formulario */}
      <div className="flex items-center justify-center min-h-screen pt-0"> 
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">Registro</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>

            {/* Mensaje de error */}
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Botón de enviar */}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none"
            >
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
