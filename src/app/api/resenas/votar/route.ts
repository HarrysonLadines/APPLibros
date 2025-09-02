import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const reseñaIdStr = context.params.id;
  const reseñaId = parseInt(reseñaIdStr);

  if (!reseñaId) {
    return NextResponse.json({ error: 'Falta reseñaId' }, { status: 400 });
  }

  const body = await req.json();
  const { tipo } = body;

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
  } catch (error: any) {
    console.error('Error al votar:', error.message);
    return NextResponse.json({ error: 'Error al registrar voto' }, { status: 500 });
  }
}
