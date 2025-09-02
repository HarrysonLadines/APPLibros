import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
export async function GET(req: NextRequest) {
  const libroId = req.nextUrl.searchParams.get('libroId');
  if (!libroId) return NextResponse.json({ error: 'Falta libroId' }, { status: 400 });

  const reseñas = await prisma.reseña.findMany({
    where: { libroId },
    include: { votos: true }, 
  });

  const data = reseñas.map((r) => {
    const likes = r.votos.filter((v) => v.tipo === 'UP').length;
    const dislikes = r.votos.filter((v) => v.tipo === 'DOWN').length;

    return {
      id: r.id,
      contenido: r.contenido,
      calificacion: r.calificacion,
      likes,
      dislikes,
    };
  });

  // Orden por cantidad de likes
  data.sort((a, b) => b.likes - a.likes);

  return NextResponse.json(data);
}




export async function POST(req: NextRequest) {
  const libroId = req.nextUrl.searchParams.get('libroId');
  console.log('libroId:', libroId);

  if (!libroId) return NextResponse.json({ error: 'Falta libroId' }, { status: 400 });

  const body = await req.json();
  console.log('body recibido:', body);

  const { contenido, calificacion, usuarioId } = body;
  if (!contenido || calificacion === undefined || calificacion === null)
  return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });


  try {
    const data: any = {
      contenido,
      calificacion,
      libroId,
    };
    if (usuarioId) data.usuario = { connect: { id: usuarioId } };

    const reseña = await prisma.reseña.create({ data });
    console.log('Reseña creada:', reseña);
    return NextResponse.json(reseña);
  } catch (error: any) {
    console.error('Error Prisma:', error.message);
    return NextResponse.json({ error: 'Error al crear reseña', detalle: error.message }, { status: 500 });
  }
}
