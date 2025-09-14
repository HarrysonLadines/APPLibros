import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/mongoose';
import Voto from '../../../../../../models/Voto';
import { Types } from 'mongoose';
import { verify } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { id } = req.query; // ID de la reseña a la que se va a votar
  console.log('ID de la reseña (voto):', id); // Imprimir el ID de la reseña
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'ID inválido' });

  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { tipo } = req.body; // Tipo de voto (UP o DOWN)

    if (!['UP', 'DOWN'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de voto inválido' });
    }

    // Obtener el token del usuario desde las cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'No estás autenticado' });
    }

    // Decodificar el token para obtener el userId
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { userId } = decoded;

    console.log('Usuario ID autenticado:', userId);  // Confirmar el ID del usuario autenticado

    // Verificar si el usuario ya ha votado por esta reseña
    const votoExistente = await Voto.findOne({
      resenaId: new Types.ObjectId(id),
      usuarioId: new Types.ObjectId(userId),
    });

    if (votoExistente) {
      return res.status(400).json({ error: 'Ya has votado por esta reseña' });
    }

    // Si no ha votado, se crea un nuevo voto
    const nuevoVoto = new Voto({
      resenaId: new Types.ObjectId(id),
      tipo,
      usuarioId: new Types.ObjectId(userId),
    });

    await nuevoVoto.save();
    console.log('Voto guardado correctamente para la reseña:', id);  // Confirmación de que el voto fue guardado

    // Devolver respuesta exitosa
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error al guardar voto:', error);
    res.status(500).json({ error: error || 'Error interno' });
  }
}
