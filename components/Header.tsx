import Image from 'next/image';
import Buscador from './Buscador';

export default function Header({ onBuscar }: { onBuscar: (query: string) => void }) {
  return (
    <header className="w-full bg-black text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/vercel.svg" alt="Logo" width={50} height={50} className="object-contain" />
          <span className="text-xl font-bold">Buscador 3000</span>
        </div>

        <div className="flex space-x-4">
          <button className="px-4 py-1 rounded-md border border-white hover:bg-white hover:text-black transition-colors duration-200">
            Iniciar sesión
          </button>
          <button className="px-4 py-1 rounded-md bg-red-500 hover:bg-red-600 transition-colors duration-200">
            Registrarse
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Buscador onBuscar={onBuscar} />
      </div>
    </header>
  );
}
