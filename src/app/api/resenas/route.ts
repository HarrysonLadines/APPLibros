import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET /api/resenas?libroId=abc123
export async function GET(req: NextRequest) {
  const libroId = req.nextUrl.searchParams.get('libroId');

  if (!libroId) {
    return NextResponse.json({ error: 'Falta libroId' }, { status: 400 });
  }

  try {
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

    data.sort((a, b) => b.likes - a.likes);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error al obtener reseñas:', error);

    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}

// POST /api/resenas?libroId=abc123
export async function POST(req: NextRequest) {
  const libroId = req.nextUrl.searchParams.get('libroId');
  console.log('libroId:', libroId);

  if (!libroId) {
    return NextResponse.json({ error: 'Falta libroId' }, { status: 400 });
  }

  try {
    const body = await req.json();
    console.log('body recibido:', body);

    const { contenido, calificacion, usuarioId } = body;

    if (!contenido || calificacion === undefined || calificacion === null) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const data: {
      contenido: string;
      calificacion: number;
      libroId: string;
      usuario?: { connect: { id: number } };
    } = {
      contenido,
      calificacion,
      libroId,
    };

    if (usuarioId) {
      data.usuario = { connect: { id: usuarioId } };
    }

    const reseña = await prisma.reseña.create({ data });

    console.log('Reseña creada:', reseña);
    return NextResponse.json(reseña);
  } catch (error: unknown) {
    console.error('Error Prisma:', error);

    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: 'Error al crear reseña', detalle: mensaje },
      { status: 500 }
    );
  }
}
