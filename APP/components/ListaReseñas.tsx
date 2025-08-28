'use client';

interface ListaReseñasProps {
  libroId: string;
  reseñas?: any[];
  setReseñas?: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ListaReseñas({ libroId, reseñas = [], setReseñas }: ListaReseñasProps) {
  const votar = async (id: number, tipo: 'UP' | 'DOWN') => {
    if (!setReseñas) return;

    // Actualización inmediata en UI
    setReseñas(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              likes: tipo === 'UP' ? r.likes + 1 : r.likes,
              dislikes: tipo === 'DOWN' ? r.dislikes + 1 : r.dislikes,
            }
          : r
      )
    );

    try {
      await fetch(`/api/resenas/${id}/votar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo }),
      });
    } catch (err) {
      console.error('Error al registrar voto:', err);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {reseñas.length === 0 && <p className="text-gray-400">No hay reseñas aún</p>}
      {reseñas.map(r => (
        <div key={r.id} className="p-3 bg-gray-800 rounded">
          <div className="flex items-center justify-between mb-1">
            <span className="text-yellow-400">{'★'.repeat(r.calificacion)}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => votar(r.id, 'UP')}
                className="text-green-400 hover:text-green-500"
              >
                👍 {r.likes || 0}
              </button>
              <button
                onClick={() => votar(r.id, 'DOWN')}
                className="text-red-400 hover:text-red-500"
              >
                👎 {r.dislikes || 0}
              </button>
            </div>
          </div>
          <p className="text-gray-200">{r.contenido || r.texto}</p>
        </div>
      ))}
    </div>
  );
}
