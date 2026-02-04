import { Router, Request, Response } from 'express';
import prisma from './client';

const router = Router();


router.get('/pokemon-cards', async (req: Request, res: Response) => {
  try {
    const pokemonCards = await prisma.pokemonCard.findMany({
      include: { type: true },
    });
    res.status(200).json(pokemonCards);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/pokemon-cards/:pokemonCardId', async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.pokemonCardId, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const pokemonCard = await prisma.pokemonCard.findUnique({
      where: { id },
      include: { type: true },
    });

    if (!pokemonCard) {
      return res.status(404).json({ error: 'PokemonCard not found' });
    }

    res.status(200).json(pokemonCard);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
