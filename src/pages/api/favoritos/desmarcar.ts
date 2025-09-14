import { NextApiRequest, NextApiResponse } from 'next';
import Favorito from '../../../../models/Favorito';
import Usuario from '../../../../models/Usuario';
import mongoose from 'mongoose';

async function desmarcarFavorito(req: NextApiRequest, res: NextApiResponse) {
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

    // Buscar los favoritos del usuario
    const favorito = await Favorito.findOne({ usuarioId });
    if (!favorito) {
      return res.status(404).json({ message: 'El usuario no tiene favoritos registrados' });
    }

    // Verificar si el libroId está en la lista de favoritos
    const libroIndex = favorito.librosIds.indexOf(libroId);
    if (libroIndex === -1) {
      return res.status(400).json({ message: 'El libro no está en la lista de favoritos' });
    }

    // Eliminar el libroId de la lista de favoritos
    favorito.librosIds.splice(libroIndex, 1);

    // Guardar los cambios en la base de datos
    try {
      await favorito.save();
      return res.status(200).json(favorito);
    } catch (error) {
      console.error('Error al desmarcar el favorito:', error);
      return res.status(500).json({ message: 'Error al desmarcar el favorito', error });
    }
  }

  return res.status(405).json({ message: 'Método no permitido' });
}

export default desmarcarFavorito;
