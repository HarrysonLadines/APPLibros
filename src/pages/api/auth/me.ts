import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Usuario from '../../../../models/Usuario';
import connect from '../../../lib/mongoose'; 

type ResponseData = {
  message?: string;
  user?: { id: string; email: string; nombre?: string };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'GET') {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
      await connect(); // Conectamos a MongoDB con Mongoose

      const user = await Usuario.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      return res.status(200).json({
        user: {
          id: user._id.toString(), // 👈 esto es clave
          email: user.email,
          nombre: user.nombre,
        },
      });
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado ' + error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
