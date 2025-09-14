import jwt, { JwtPayload } from 'jsonwebtoken';
import { getCookie } from '@/utils/cookies';
import { NextApiRequest } from 'next';

export const authenticate = (req: NextApiRequest) => {
  // Pasar `req` a `getCookie` para obtener el token desde las cookies en el servidor
  const token = getCookie('token', req);
  console.log("Token recibido en el backend:", token);

  if (!token) {
    throw new Error('No token proporcionado');
  }

  try {
    // Verificar el token usando el secret y hacer un type casting del decoded
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { userId: string }; 

    console.log("Token decodificado en AuthMiddleware:", decoded); // Aquí agregamos un log

    return decoded;
  } catch (err) {
    console.error('Error al verificar el token:', err); // Aquí añadimos un log de error
    throw new Error('Token inválido o expirado');
  }
};
