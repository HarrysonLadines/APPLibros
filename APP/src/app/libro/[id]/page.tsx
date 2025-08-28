import { buscarLibroPorID } from '../../lib/apiGoogleBooks';
import DetalleLibro from '../../../../components/DetalleLibro';

export default async function PaginaLibro({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;   
  const libro = await buscarLibroPorID(id);

  if (!libro) {
    return (
      <main className="p-6 flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Libro no encontrado.</p>
      </main>
    );
  }

  return (
    <main className="p-6 bg-black min-h-screen">
      <DetalleLibro libro={libro} />
    </main>
  );
}
