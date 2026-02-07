import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  // 1. Pega o header "Authorization" (Bearer TOKEN)
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const [, token] = authHeader.split(' ');

  try {
    // 2. Verifica se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. INJETA os dados no req.user (Aqui é onde a mágica acontece!)
    req.user = decoded; 
    
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};