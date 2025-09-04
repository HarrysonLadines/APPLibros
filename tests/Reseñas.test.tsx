import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ListaReseñas from "../components/ListaReseñas";
import ReseñaForm from "../components/ReseñaForm";
import { ReseñaConVotos } from "../types/reseña";
import { act } from "react";


describe("ListaReseñas", () => {
  it("muestra reseñas y permite votar UP/DOWN", () => {
    const setReseñasMock = vi.fn();
    const reseñas: ReseñaConVotos[] = [
      {
        id: 1,
        libroId: "1",
        contenido: "Excelente libro",
        calificacion: 5,
        likes: 0,
        dislikes: 0,
        fechaCreacion: String(new Date()),
      },
    ];

    render(<ListaReseñas libroId="1" reseñas={reseñas} setReseñas={setReseñasMock} />);

    expect(screen.getByText("Excelente libro")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/👍 0/));
    expect(setReseñasMock).toHaveBeenCalled();
  });

  it("muestra mensaje cuando no hay reseñas", () => {
    render(<ListaReseñas libroId="1" reseñas={[]} />);
    expect(screen.getByText("No hay reseñas aún")).toBeInTheDocument();
  });
});

describe("ReseñaForm", () => {
  it("permite enviar una nueva reseña y llama onNuevaReseña", async () => {
    const onNuevaReseñaMock = vi.fn();

    // Mock del fetch que simula respuesta exitosa
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 123, contenido: "Excelente libro", calificacion: 5 }),
    });

    render(<ReseñaForm libroId="1" onNuevaReseña={onNuevaReseñaMock} />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Escribe tu reseña..."), {
        target: { value: "Excelente libro" },
      });

      fireEvent.change(screen.getByLabelText("Calificación:"), {
        target: { value: "5" },
      });

      fireEvent.click(screen.getByText("Publicar Reseña"));
    });

    await waitFor(() => {
      expect(onNuevaReseñaMock).toHaveBeenCalledWith({
        id: 123,
        contenido: "Excelente libro",
        calificacion: 5,
      });
    });
  });
});
