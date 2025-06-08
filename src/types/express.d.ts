interface UserPayload {
  id: number;
  email: string;
}

declare namespace Express {
  export interface Request {
    user?: UserPayload; // Adiciona o usuário ao Request, opcionalmente
  }
}