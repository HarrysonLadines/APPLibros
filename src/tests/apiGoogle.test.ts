import { describe, it, expect, vi, beforeEach } from "vitest";
import { buscarLibroPorID, buscarLibros } from "../lib/apiGoogleBooks";

// Tipamos fetch como un mock de Vitest
global.fetch = vi.fn();

describe("API Google Books", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("buscarLibros llama a fetch y retorna items", async () => {
    const mockResponse = {
      json: async () => ({
        items: [{ id: "1", volumeInfo: { title: "Test" } }],
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await buscarLibros("Test");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("buscarLibroPorID llama a fetch y retorna libro", async () => {
    const mockResponse = {
      json: async () => ({
        id: "1",
        volumeInfo: { title: "Libro" },
      }),
    };

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await buscarLibroPorID("1");
    expect(result.id).toBe("1");
  });
});
