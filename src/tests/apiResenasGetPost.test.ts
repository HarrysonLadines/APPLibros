import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiResenas from "../api/resenas";

vi.mock("../src/app/lib/prisma", () => ({
  prisma: {
    reseña: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("API Resenas GET/POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET devuelve error si falta libroId", async () => {
    const req = { nextUrl: { searchParams: { get: () => null } } } as any;
    const res = await apiResenas.GET(req);
    expect(res.status).toBe(400);
  });

  it("POST crea una reseña", async () => {
    const req = {
      nextUrl: { searchParams: new URLSearchParams({ libroId: "1" }) },
      json: async () => ({ contenido: "Test", calificacion: 5 }),
    } as any;

    (prisma.reseña.create as any).mockResolvedValue({ id: 1, contenido: "Test" });

    const res = await apiResenas.POST(req);
    const data = await res.json();

    expect(data).toHaveProperty("id", 1);
    expect(data.contenido).toBe("Test");
  });
});
