// types/reseña.ts
import { Voto } from './voto';

export interface Reseña {
  id: number;
  calificacion: number;
  contenido: string;
  fechaCreacion: string;
  libroId: string;
  usuarioId?: number;
  votos: Voto[];
}

export interface NuevaReseña {
  libroId: string;
  contenido: string;
  calificacion: number;
  likes: number;
  dislikes: number;
  fecha: string; 
}

export interface ReseñaConVotos extends Omit<Reseña, 'votos'> {
  likes: number;
  dislikes: number;
}
