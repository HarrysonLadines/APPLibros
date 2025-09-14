import { NextApiRequest, NextApiResponse } from 'next';
import Favorito from '../../../../models/Favorito';
import mongoose from 'mongoose';

async function obtenerFavoritos(req: NextApiRequest, res: NextApiResponse) {
  const { usuarioId } = req.query;  // Accedemos al usuarioId de la URL

  if (req.method === 'GET') {
    // Validar que el usuarioId esté presente
    if (!usuarioId) {
      return res.status(400).json({ message: 'Falta el parámetro usuarioId' });
    }

    // Validar que usuarioId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(usuarioId as string)) {
      return res.status(400).json({ message: 'El usuarioId no es válido' });
    }

    try {
      // Buscar el documento de Favorito correspondiente al usuario
      const favorito = await Favorito.findOne({ usuarioId })
        .populate('librosIds', 'title authors publishedDate') // Poblamos los libros con los campos deseados
        .exec();

      console.log(favorito);  // Agrega este log para ver los datos completos
      
      if (!favorito) {
        return res.status(404).json({ message: 'No se encontraron libros favoritos para este usuario' });
      }

      // Retornar los libros favoritos, con los detalles completos
      return res.status(200).json(favorito.librosIds); // En la respuesta ya tendrás los libros completos
    } catch (error) {
      console.error('Error al obtener los favoritos:', error);
      return res.status(500).json({ message: 'Error al obtener los favoritos', error });
    }
  }

  return res.status(405).json({ message: 'Método no permitido' });
}

export default obtenerFavoritos;
