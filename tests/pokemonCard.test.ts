import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('GET /pokemon-cards', () => {
  it('lister tous les pokemons avec status 200', async () => {
    const pokemonsMock = [
      {
        id: 1,
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 1,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'url',
      },
    ];
    prismaMock.pokemonCard.findMany.mockResolvedValue(pokemonsMock as any);
    const response = await request(app).get('/pokemon-cards');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(pokemonsMock);
  });
});

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('devrait modifier un pokemon existant avec un token valide (Status 200)', async () => {
      const existingCard = {
        id: 1, name: 'Bulbizarre', pokedexId: 1, typeId: 1, lifePoints: 45
      };
      const updatedCard = { ...existingCard, lifePoints: 50 };

      // Prisma trouve la carte existante
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard as any);
      
      // Prisma simule la mise à jour
      prismaMock.pokemonCard.update.mockResolvedValue(updatedCard as any);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken') // Token requis !
        .send({ lifePoints: 50 }); // On modifie juste les points de vie

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCard);
    });

    it('devrait retourner 404 si on modifie un pokemon inexistant', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch('/pokemon-cards/999')
        .set('Authorization', 'Bearer mockedToken')
        .send({ lifePoints: 50 });

      expect(response.status).toBe(404);
    });
  });