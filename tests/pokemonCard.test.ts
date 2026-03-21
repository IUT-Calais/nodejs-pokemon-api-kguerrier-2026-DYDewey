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