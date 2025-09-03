"use client";

import React, { useState } from "react";
import { ReseñaConVotos } from "../types/reseña"; 

interface ReseñaFormProps {
  libroId: string;
  onNuevaReseña: (reseña: ReseñaConVotos) => void;
}

export default function ReseñaForm({ libroId, onNuevaReseña }: ReseñaFormProps) {
  const [texto, setTexto] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim() || calificacion === 0) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/resenas?libroId=${libroId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: texto,
          calificacion,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar en BD");

      const reseñaCreada: ReseñaConVotos = await res.json();

      onNuevaReseña(reseñaCreada);
      setTexto("");
      setCalificacion(0);
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la reseña en la base de datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        className="w-full p-2 border rounded-lg"
        placeholder="Escribe tu reseña..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <label>Calificación:</label>
        <select
          value={calificacion}
          onChange={(e) => setCalificacion(Number(e.target.value))}
          className="border p-1 rounded"
        >
          <option value={0}>Selecciona</option>
          <option value={1}>⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={5}>⭐⭐⭐⭐⭐</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        {loading ? "Guardando..." : "Publicar Reseña"}
      </button>
    </form>
  );
}
