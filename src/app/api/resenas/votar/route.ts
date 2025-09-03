import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

type VotarContext = { params: { id: string } };

export async function POST(req: NextRequest, context: VotarContext) {
  const { params } = context;

  const reseñaId = parseInt(params.id, 10);
  if (isNaN(reseñaId)) {
    return NextResponse.json({ error: 'Falta reseñaId válido' }, { status: 400 });
  }

  const body = await req.json();
  const { tipo } = body as { tipo: 'UP' | 'DOWN' };

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
    const message =
      error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error al registrar voto: ${message}` },
      { status: 500 }
    );
  }
}
