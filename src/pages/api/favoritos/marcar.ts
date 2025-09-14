// src/pages/api/favoritos/marcar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Favorito from '../../../../models/Favorito';
import Usuario from '../../../../models/Usuario';
import mongoose from 'mongoose';

async function marcarFavorito(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { usuarioId, libroId } = req.body;

    // Validar que los parámetros estén presentes
    if (!usuarioId || !libroId) {
      return res.status(400).json({ message: 'Faltan parámetros: usuarioId o libroId' });
    }

    // Validar que usuarioId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: 'El usuarioId no es válido' });
    }

    // Validar que libroId sea un string válido
    if (typeof libroId !== 'string' || libroId.trim() === '') {
      return res.status(400).json({ message: 'El libroId debe ser un string válido' });
    }

    // Validar que el usuario exista
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si ya existe un favorito para el usuario
    let favorito = await Favorito.findOne({ usuarioId });
    if (!favorito) {
      // Si no existe, creamos una nueva lista de favoritos
      favorito = new Favorito({
        usuarioId,
        librosIds: [libroId], // Agregar libroId directamente como string
        creadoEn: new Date(),
      });
    } else {
      // Si existe, agregamos el libroId a la lista si no está ya marcado
      if (!favorito.librosIds.includes(libroId)) {
        favorito.librosIds.push(libroId);
      } else {
        return res.status(400).json({ message: 'El libro ya está en la lista de favoritos' });
      }
    }

    // Guardar en la base de datos
    try {
      await favorito.save();
      return res.status(200).json(favorito);
    } catch (error) {
      console.error('Error al guardar el favorito:', error);
      return res.status(500).json({ message: 'Error al marcar como favorito', error });
    }
  }

  return res.status(405).json({ message: 'Método no permitido' });
}

export default marcarFavorito;
