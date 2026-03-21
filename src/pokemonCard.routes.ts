import { Router, Request, Response } from 'express';
import prisma from './client';
import { verifierToken } from './middleware';

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
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  try {
    const pokemonCard = await prisma.pokemonCard.findUnique({
      where: { id },
      include: { type: true },
    });
    if (!pokemonCard) {
      res.status(404).json({ error: 'PokemonCard not found' });
      return;
    }
    res.status(200).json(pokemonCard);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/pokemon-cards/:pokemonCardId',verifierToken,async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.pokemonCardId, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;
    try {
      const card = await prisma.pokemonCard.findUnique({ where: { id } });
      if (!card) {
        res.status(404).json({ error: 'PokemonCard not found' });
        return;
      }
      if (typeId != null) {
        const type = await prisma.type.findUnique({
          where: { id: Number(typeId) },
        });
        if (!type) {
          res.status(400).json({ error: 'typeId does not exist' });
          return;
        }
      }
      if (name) {
        const otherByName = await prisma.pokemonCard.findUnique({
          where: { name },
        });
        if (otherByName && otherByName.id !== id) {
          res.status(400).json({ error: 'name already exists' });
          return;
        }
      }
      if (pokedexId != null) {
        const otherByPokedex = await prisma.pokemonCard.findUnique({
          where: { pokedexId: Number(pokedexId) },
        });
        if (otherByPokedex && otherByPokedex.id !== id) {
          res.status(400).json({ error: 'pokedexId already exists' });
          return;
        }
      }
      const updated = await prisma.pokemonCard.update({
        where: { id },
        data: {
          name: name ?? card.name,
          pokedexId: pokedexId != null ? Number(pokedexId) : card.pokedexId,
          typeId: typeId != null ? Number(typeId) : card.typeId,
          lifePoints: lifePoints != null ? Number(lifePoints) : card.lifePoints,
          size: Number(size ?? 0),
          weight: Number(weight ?? 0),
          imageUrl: imageUrl ?? card.imageUrl,
        },
      });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.post('/pokemon-cards',verifierToken,async (req: Request, res: Response) => {
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;
    if (!name) {
      res.status(400).json({ error: 'name is required' });
      return;
    }
    if (pokedexId == null) {
      res.status(400).json({ error: 'pokedexId is required' });
      return;
    }
    if (typeId == null) {
      res.status(400).json({ error: 'typeId is required' });
      return;
    }
    if (lifePoints == null) {
      res.status(400).json({ error: 'lifePoints is required' });
      return;
    }
    try {
      const type = await prisma.type.findUnique({
        where: { id: Number(typeId) },
      });
      if (!type) {
        res.status(400).json({ error: 'typeId does not exist' });
        return;
      }
      const sameName = await prisma.pokemonCard.findUnique({
        where: { name },
      });
      if (sameName) {
        res.status(400).json({ error: 'name already exists' });
        return;
      }
      const samePokedexId = await prisma.pokemonCard.findUnique({
        where: { pokedexId: Number(pokedexId) },
      });
      if (samePokedexId) {
        res.status(400).json({ error: 'pokedexId already exists' });
        return;
      }
      const created = await prisma.pokemonCard.create({
        data: {
          name,
          pokedexId: Number(pokedexId),
          typeId: Number(typeId),
          lifePoints: Number(lifePoints),
          size: Number(size ?? 0),
          weight: Number(weight ?? 0),
          imageUrl: imageUrl ?? null,
        },
      });
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete('/pokemon-cards/:pokemonCardId',verifierToken,async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.pokemonCardId, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    try {
      const card = await prisma.pokemonCard.findUnique({ where: { id } });
      if (!card) {
        res.status(404).json({ error: 'PokemonCard not found' });
        return;
      }
      await prisma.pokemonCard.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;