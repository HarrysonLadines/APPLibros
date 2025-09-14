import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/resenas/[id]/votar/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';

vi.mock('@/app/lib/prisma', () => ({
  prisma: {
    voto: { create: vi.fn() },
  },
}));

describe('API /api/resenas/:id/votar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('crea voto UP correctamente', async () => {
    const req = {
      json: () => Promise.resolve({ tipo: 'UP' }),
    } as unknown as NextRequest;

    const context = { params: { id: '1' } };

    (prisma.voto.create as any).mockResolvedValueOnce({ id: 1, tipo: 'UP' });

    const res = await POST(req, context);
    const data = await res.json();
    expect(data.tipo).toBe('UP');
  });

  it('devuelve error 400 si tipo inválido', async () => {
    const req = {
      json: () => Promise.resolve({ tipo: 'INVALID' }),
    } as unknown as NextRequest;

    const context = { params: { id: '1' } };

    const res = await POST(req, context);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe('Tipo de voto inválido');
  });

  it('devuelve error 400 si falta id', async () => {
    const req = {
      json: () => Promise.resolve({ tipo: 'UP' }),
    } as unknown as NextRequest;

    const context = { params: { id: '' } };

    const res = await POST(req, context);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe('Falta reseñaId');
  });
});
