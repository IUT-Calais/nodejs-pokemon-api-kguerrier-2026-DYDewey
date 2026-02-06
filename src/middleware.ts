import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to store user id from the token
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// Simple auth middleware to check JWT token
export function verifierToken(req: Request, res: Response, next: NextFunction) {
  // We expect something like: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // No token provided
    return res.status(401).json({ error: 'token manquant' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';

    // Decode and verify token
    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
    };

    // Store user id on the request object for later use
    req.userId = decoded.id;

    // Go to next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(403).json({ error: 'token invalide ou expiré' });
  }
}
