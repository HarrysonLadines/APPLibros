import { ReseñaConVotos } from '../src/types/reseña';
import React, { useState } from 'react';

interface ListaReseñasProps {
  libroId: string;
  reseñas?: ReseñaConVotos[];
  setReseñas?: React.Dispatch<React.SetStateAction<ReseñaConVotos[]>>;
  usuarioId: string; // Para verificar si el usuario es dueño de la reseña
}

export default function ListaReseñas({ reseñas = [], setReseñas, usuarioId }: ListaReseñasProps) {
  const [editReseñaId, setEditReseñaId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState<string>('');
  const [newCalificacion, setNewCalificacion] = useState<number>(0);

  // Función para votar una reseña (like o dislike)
  const votar = async (id: string, tipo: 'UP' | 'DOWN') => {
    if (!setReseñas) return;

    setReseñas(prev =>
      prev.map(r =>
        r._id.toString() === id
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error al registrar voto:', message);
    }
  };

  // Abrir el formulario para editar una reseña
  const handleEdit = (resenaId: string, contenido: string, calificacion: number) => {
    setEditReseñaId(resenaId);
    setNewContent(contenido);
    setNewCalificacion(calificacion);
  };

  // Guardar los cambios editados en la reseña
  const handleSaveEdit = async () => {
    if (!editReseñaId) return;

    try {
      const res = await fetch(`/api/resenas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resenaId: editReseñaId,
          contenido: newContent,
          calificacion: newCalificacion,
        }),
      });

      if (res.ok) {
        if (setReseñas) {
          setReseñas(prev =>
            prev.map(r =>
              r._id.toString() === editReseñaId
                ? { ...r, contenido: newContent, calificacion: newCalificacion }
                : r
            )
          );
        }
        setEditReseñaId(null);
        setNewContent('');
        setNewCalificacion(0);
      } else {
        const errorData = await res.json();
        alert(`Error al guardar la reseña: ${errorData.error}`);
      }
    } catch (err) {
      alert('Error al guardar la reseña: ' + err);
    }
  };

  // Cancelar la edición de una reseña
  const handleCancelEdit = () => {
    setEditReseñaId(null);
    setNewContent('');
    setNewCalificacion(0);
  };

  // Eliminar una reseña con confirmación
  const handleDelete = async (resenaId: string) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta reseña?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/resenas?id=${resenaId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (setReseñas) {
          setReseñas(prev => prev.filter(r => r._id.toString() !== resenaId));
        }
      } else {
        alert('Error al eliminar la reseña');
      }
    } catch (err) {
      alert('Error al eliminar la reseña, inténtalo de nuevo más tarde.' + err);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {reseñas.length === 0 && <p className="text-gray-400">No hay reseñas aún</p>}
      {reseñas.map((r: ReseñaConVotos) => (
        <div key={r._id.toString()} className="p-3 bg-gray-800 rounded">
          <div className="flex items-center justify-between mb-1">
            <span className="text-yellow-400">{'★'.repeat(r.calificacion)}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => votar(r._id.toString(), 'UP')}
                className="text-green-400 hover:text-green-500"
              >
                👍 {r.likes}
              </button>
              <button
                onClick={() => votar(r._id.toString(), 'DOWN')}
                className="text-red-400 hover:text-red-500"
              >
                👎 {r.dislikes}
              </button>
            </div>
          </div>

          <p className="text-gray-200">{r.contenido}</p>

          {editReseñaId === r._id.toString() && (
            <div className="mt-4">
              <textarea
                className="w-full p-2 rounded text-white"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
              />
              <div className="mt-2">
                <label className="block text-yellow-400">Calificación:</label>
                <select
                  className="w-full p-2 rounded text-yellow bg-gray-500"
                  value={newCalificacion}
                  onChange={(e) => setNewCalificacion(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((cal) => (
                    <option key={cal} value={cal}>
                      {cal} Estrellas
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Mostrar botones de editar y eliminar solo si el usuario es dueño y no está editando */}
          {r.usuarioId?.toString() === usuarioId && !editReseñaId && (
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleEdit(r._id.toString(), r.contenido, r.calificacion)}
                className="text-yellow-400 hover:text-yellow-500"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDelete(r._id.toString())}
                className="text-red-400 hover:text-red-500"
              >
                🗑️ Eliminar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
