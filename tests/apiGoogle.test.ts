import { describe, it, expect, vi, beforeEach } from "vitest";
import { buscarLibroPorID, buscarLibros } from "../src/app/lib/apiGoogleBooks";

global.fetch = vi.fn();

describe("API Google Books", () => {
  beforeEach(() => {
    (global.fetch as any).mockReset();
  });

  it("buscarLibros llama a fetch y retorna items", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ items: [{ id: "1", volumeInfo: { title: "Test" } }] }),
    });

    const result = await buscarLibros("Test");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("buscarLibroPorID llama a fetch y retorna libro", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ id: "1", volumeInfo: { title: "Libro" } }),
    });

    const result = await buscarLibroPorID("1");
    expect(result.id).toBe("1");
  });
});
