import { Reseña } from './reseña';

export type TipoVoto = 'UP' | 'DOWN';

export interface Voto {
  id: number;
  valor?: number;
  tipo: TipoVoto;
  usuarioId?: number;
  reseñaId: number;
  reseña: Reseña;
}
