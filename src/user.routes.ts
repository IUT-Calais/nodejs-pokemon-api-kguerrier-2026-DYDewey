import { Router, Request, Response } from 'express';
import prisma from './client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/users', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'email obligatoire' });
  }
  if (!password) {
    return res.status(400).json({ error: 'mot de passe obligatoire' });
  }

  try {
    const utilisateur = await prisma.user.findUnique({ where: { email } });
    if (utilisateur) {
      return res.status(400).json({ error: 'email déjà utilisé' });
    }

    const motDePasseCrypte = await bcrypt.hash(password, 10);

    const nouvelUtilisateur = await prisma.user.create({
      data: {
        email,
        password: motDePasseCrypte,
      },
    });

    res.status(201).json({
      id: nouvelUtilisateur.id,
      email: nouvelUtilisateur.email,
    });
  } catch (error) {
    res.status(500).json({ error: 'erreur serveur' });
  }
});

router.post('/users/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'email et mot de passe obligatoires' });
  }

  try {
    const utilisateur = await prisma.user.findUnique({ where: { email } });
    if (!utilisateur) {
      return res.status(404).json({ error: 'utilisateur introuvable' });
    }

    const motDePasseOk = await bcrypt.compare(password, utilisateur.password);
    if (!motDePasseOk) {
      return res.status(400).json({ error: 'mot de passe incorrect' });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const duree = process.env.JWT_EXPIRATION || '1h';

    const token = jwt.sign(
      { id: utilisateur.id, email: utilisateur.email },
      secret,
      { expiresIn: duree }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'erreur serveur' });
  }
});

export default router;
