// src/types/index.ts
export interface Evento {
  id: string;
  nome: string;
  data: string; // ISO String vinda do banco
  local: string;
  status: 'Ativo' | 'Encerrado' | 'Cancelado';
}

export interface User {
  id: string;
  name: string;
  email: string;
}