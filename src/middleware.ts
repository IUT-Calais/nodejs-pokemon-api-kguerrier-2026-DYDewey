import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function verifierToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'token manquant' });
    return; // <-- C'est ça qui corrige TypeScript !
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
    };

    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ error: 'token invalide ou expiré' });
    return;
  }
}