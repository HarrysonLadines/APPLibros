import { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/mongoose';
import Resena from '../../../../../models/Resena';
import { Types } from 'mongoose';
import { authenticate } from '@/lib/authMiddleware';
import Cors from 'nextjs-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configuración de CORS
  await Cors(req, res, {
    methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
    origin: 'http://localhost:3000',  // Tu dominio frontend
    credentials: true, // Habilitar el envío de cookies
  });

  const { usuarioId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const decoded = authenticate(req); // Verifica el token JWT

    // Verificar si el usuario logueado es el que está solicitando las reseñas
    if (decoded.userId !== usuarioId) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a estas reseñas' });
    }

    await connect(); // Conexión a la base de datos

    // Validamos que el usuarioId sea un string y que sea un ID válido de MongoDB
    if (!usuarioId || Array.isArray(usuarioId) || !Types.ObjectId.isValid(usuarioId as string)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    // Buscamos las reseñas del usuario en la base de datos
    const reseñas = await Resena.find({ usuarioId: new Types.ObjectId(usuarioId) })
      .populate('libroId', 'titulo')  // Poblar el campo libroId (ajustar según tu esquema de Resena)
      .lean()
      .exec();

    // Respondemos con las reseñas encontradas
    return res.status(200).json(reseñas);

  } catch (error: unknown) {
    console.error('Error al obtener las reseñas del usuario', error); // Agregamos más detalles en el log
    return res.status(500).json({ error: error || 'Error al obtener las reseñas' });
  }
}
