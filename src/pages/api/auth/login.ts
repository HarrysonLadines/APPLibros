import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import Usuario from '../../../../models/Usuario';
import connect from '../../../lib/mongoose';

type ResponseData = {
  message?: string;
  token?: string;  // Aquí agregamos el token en la respuesta
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    await connect(); // Conectamos a MongoDB con Mongoose

    // Verificar si el usuario existe
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Comparar la contraseña con el hash guardado
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Generar un JWT
    const token = jwt.sign({ userId: user._id, email: user.email, nombre: user.nombre }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    // Establecer la cookie JWT
res.setHeader(
  'Set-Cookie', 
  `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; Secure=false`
);




    // Responder con el mensaje de éxito y el token (si es necesario)
    return res.status(200).json({ message: 'Login exitoso', token });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
