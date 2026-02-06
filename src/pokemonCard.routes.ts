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

// PATCH /pokemon-cards/:pokemonCardId : update an existing card (protected)
router.patch(
  '/pokemon-cards/:pokemonCardId',
  verifierToken,
  async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.pokemonCardId, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } =
      req.body;

    try {
      const card = await prisma.pokemonCard.findUnique({ where: { id } });
      if (!card) {
        return res.status(404).json({ error: 'PokemonCard not found' });
      }

      if (typeId != null) {
        const type = await prisma.type.findUnique({
          where: { id: Number(typeId) },
        });
        if (!type) {
          return res.status(400).json({ error: 'typeId does not exist' });
        }
      }

      if (name) {
        const otherByName = await prisma.pokemonCard.findUnique({
          where: { name },
        });
        if (otherByName && otherByName.id !== id) {
          return res.status(400).json({ error: 'name already exists' });
        }
      }

      if (pokedexId != null) {
        const otherByPokedex = await prisma.pokemonCard.findUnique({
          where: { pokedexId: Number(pokedexId) },
        });
        if (otherByPokedex && otherByPokedex.id !== id) {
          return res
            .status(400)
            .json({ error: 'pokedexId already exists' });
        }
      }

      const updated = await prisma.pokemonCard.update({
        where: { id },
        data: {
          name: name ?? card.name,
          pokedexId:
            pokedexId != null ? Number(pokedexId) : card.pokedexId,
          typeId: typeId != null ? Number(typeId) : card.typeId,
          lifePoints:
            lifePoints != null ? Number(lifePoints) : card.lifePoints,
          size: size != null ? Number(size) : card.size,
          weight: weight != null ? Number(weight) : card.weight,
          imageUrl: imageUrl ?? card.imageUrl,
        },
      });

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /pokemon-cards : create a new pokemon card (protected)
router.post(
  '/pokemon-cards',
  verifierToken,
  async (req: Request, res: Response) => {
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } =
      req.body;

    // Required fields checks
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (pokedexId == null) {
      return res.status(400).json({ error: 'pokedexId is required' });
    }
    if (typeId == null) {
      return res.status(400).json({ error: 'typeId is required' });
    }
    if (lifePoints == null) {
      return res.status(400).json({ error: 'lifePoints is required' });
    }

    try {
      // Check if type exists
      const type = await prisma.type.findUnique({
        where: { id: Number(typeId) },
      });
      if (!type) {
        return res.status(400).json({ error: 'typeId does not exist' });
      }

      // Check duplicate name
      const sameName = await prisma.pokemonCard.findUnique({
        where: { name },
      });
      if (sameName) {
        return res.status(400).json({ error: 'name already exists' });
      }

      // Check duplicate pokedexId
      const samePokedexId = await prisma.pokemonCard.findUnique({
        where: { pokedexId: Number(pokedexId) },
      });
      if (samePokedexId) {
        return res.status(400).json({ error: 'pokedexId already exists' });
      }

      const created = await prisma.pokemonCard.create({
        data: {
          name,
          pokedexId: Number(pokedexId),
          typeId: Number(typeId),
          lifePoints: Number(lifePoints),
          size: size != null ? Number(size) : null,
          weight: weight != null ? Number(weight) : null,
          imageUrl: imageUrl ?? null,
        },
      });

      return res.status(201).json(created);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);



export default router;
