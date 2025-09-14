import { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/mongoose';
import Resena from '../../../../models/Resena';
import Usuario from '../../../../models/Usuario'; 
import Voto from '../../../../models/Voto';
import { Types } from 'mongoose';
//import { IResena } from '../../../../models/Resena';  
import { VotoFrontend } from '@/types/voto'; 
import mongoose from 'mongoose';
import { verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
//import { Reseña, ReseñaConVotos } from '@/types/reseña';

interface ReseñaFrontend {
  _id: string;
  calificacion: number;
  contenido: string;
  fechaCreacion: Date;
  libroId: string;
  usuarioId?: string | null;
}

interface UsuarioPopulado {
  _id: Types.ObjectId;
  nombre: string;
}

interface ResenaConUsuario {
  _id: Types.ObjectId;
  contenido: string;
  calificacion: number;
  fechaCreacion: Date;
  libroId: string;
  usuarioId?: UsuarioPopulado | null;
}

// Tipo para votos con usuario poblado (por populate)
type VotoPoblado = {
  _id: ObjectId;
  tipo: 'UP' | 'DOWN';
  resenaId: ObjectId;
  usuarioId?: {
    _id: ObjectId;
    nombre: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Conectar a la base de datos MongoDB
  try {
    await connect();
  } catch (error) {
    return res.status(500).json({ error: 'Error al conectar a la base de datos: ' + error });
  }

  const { method } = req;

  // -------------- GET - Obtener reseñas y votos para un libro --------------
  if (method === 'GET') {
    const libroId = req.query.libroId as string;
    if (!libroId) {
      return res.status(400).json({ error: 'Falta libroId' });
    }

    try {
      // Registrar modelo Usuario si no está registrado (para evitar errores de mongoose)
      if (!mongoose.models.Usuario) {
        mongoose.model('Usuario', Usuario.schema);
      }

      // Obtener reseñas del libro, ordenadas por fecha (más recientes primero), con usuario poblado solo con el nombre
      const reseñasRaw = await Resena.find({ libroId })
  .sort({ fechaCreacion: -1 })
  .populate('usuarioId', 'nombre')
  .lean()
  .exec() as unknown as ResenaConUsuario[];


      // Mapear las reseñas para devolver solo lo necesario y convertir ObjectId a string en usuarioId
      const reseñasFrontend: ReseñaFrontend[] = reseñasRaw.map((r) => ({
  _id: r._id.toString(),
  contenido: r.contenido,
  calificacion: r.calificacion,
  fechaCreacion: r.fechaCreacion,
  libroId: r.libroId,
  usuarioId: r.usuarioId ? r.usuarioId._id.toString() : null,
}));

      // Extraer los IDs de las reseñas para consulta de votos
      const reseñaIds = reseñasFrontend.map((r) => r._id);

      // Obtener votos de las reseñas con usuario poblado (nombre)
      const votosRaw = await Voto.find({ resenaId: { $in: reseñaIds } })
        .populate('usuarioId', 'nombre')
        .lean()
        .exec() as unknown as VotoPoblado[];

      // Mapear votos para frontend: convertir ObjectId a string
      const votosFrontend: VotoFrontend[] = votosRaw.map((v) => ({
        _id: v._id.toString(),
        tipo: v.tipo,
        reseñaId: v.resenaId.toString(),
        usuarioId: v.usuarioId ? v.usuarioId._id.toString() : undefined,
      }));

      // Asociar votos con cada reseña, contando likes y dislikes
      const data = reseñasFrontend.map((r) => {
        const votosDeReseña = votosFrontend.filter((v) => v.reseñaId === r._id.toString());
        const likes = votosDeReseña.filter((v) => v.tipo === 'UP').length;
        const dislikes = votosDeReseña.filter((v) => v.tipo === 'DOWN').length;

        return {
          _id: r._id,
          contenido: r.contenido,
          calificacion: r.calificacion,
          likes,
          dislikes,
          usuarioId: r.usuarioId,
        };
      });

      // Ordenar las reseñas según la cantidad de likes (descendente)
      data.sort((a, b) => b.likes - a.likes);

      // Enviar la respuesta JSON con las reseñas y votos
      return res.status(200).json(data);

    } catch (error) {
      console.error('Error en GET /reseñas:', error);
      return res.status(500).json({ error: error || 'Error interno' });
    }
  }

  // -------------- DELETE - Eliminar una reseña --------------
  else if (method === 'DELETE') {
    const { token } = req.cookies; // Token JWT
    const { id } = req.query;      // Id de la reseña a eliminar

    if (!id) {
      return res.status(400).json({ error: 'ID de reseña no proporcionado' });
    }

    if (!token) {
      return res.status(401).json({ error: 'No estás autenticado' });
    }

    try {
      // Verificar token y obtener userId
      const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
      const { userId } = decoded;

      // Verificar que la reseña existe
      const reseña = await Resena.findById(id);
      if (!reseña) {
        return res.status(404).json({ error: 'Reseña no encontrada' });
      }

      // Verificar que el usuario es el autor
      if (reseña.usuarioId.toString() !== userId) {
        return res.status(403).json({ error: 'No tienes permisos para eliminar esta reseña' });
      }

      // Eliminar la reseña
      await Resena.deleteOne({ _id: id });

      return res.status(200).json({ message: 'Reseña eliminada correctamente' });

    } catch (err) {
      return res.status(500).json({ error: 'Error al eliminar la reseña', details: err });
    }
  }

  // -------------- POST - Crear una nueva reseña --------------
  else if (method === 'POST') {
    const { contenido, calificacion, libroId } = req.body;

    // Validar datos de entrada
    if (!contenido || !calificacion || !libroId) {
      return res.status(400).json({ error: 'Faltan datos necesarios' });
    }

    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'No estás autenticado' });
    }

    try {
      // Validar token y extraer userId
      const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
      const { userId } = decoded;

      // Crear y guardar la reseña nueva
      const nuevaReseña = new Resena({
        contenido,
        calificacion,
        libroId,
        usuarioId: new Types.ObjectId(userId),
      });

      const savedReseña = await nuevaReseña.save();

      return res.status(201).json(savedReseña);

    } catch (err) {
      return res.status(500).json({ error: 'Error al crear la reseña', details: err });
    }
  }

  // -------------- PUT - Editar una reseña existente --------------
  else if (method === 'PUT') {
    const { token } = req.cookies;
    const { resenaId, contenido, calificacion } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'No estás autenticado' });
    }

    try {
      // Verificar token y obtener userId
      const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
      const { userId } = decoded;

      // Buscar reseña a editar
      const reseña = await Resena.findById(resenaId);
      if (!reseña) {
        return res.status(404).json({ error: 'Reseña no encontrada' });
      }

      // Validar que el usuario sea el autor
      if (reseña.usuarioId.toString() !== userId) {
        return res.status(403).json({ error: 'No tienes permisos para editar esta reseña' });
      }

      // Actualizar campos
      reseña.contenido = contenido || reseña.contenido;
      reseña.calificacion = calificacion || reseña.calificacion;

      // Guardar cambios
      const updatedReseña = await reseña.save();
      return res.status(200).json(updatedReseña);

    } catch (err) {
      return res.status(500).json({ error: 'Error al editar la reseña', details: err });
    }
  }

  // -------------- Método no permitido --------------
  else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
}
