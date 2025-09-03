import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: {
    id: string
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  const reseñaId = parseInt(context.params.id);

  if (!reseñaId) {
    return NextResponse.json({ error: 'Falta reseñaId' }, { status: 400 });
  }

  const { tipo } = await req.json();

  if (!['UP', 'DOWN'].includes(tipo)) {
    return NextResponse.json({ error: 'Tipo de voto inválido' }, { status: 400 });
  }

  try {
    const voto = await prisma.voto.create({
      data: {
        tipo,
        reseña: { connect: { id: reseñaId } },
      },
    });

    return NextResponse.json(voto);
  } catch (error: unknown) {
    console.error('Error al votar:', error);
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
