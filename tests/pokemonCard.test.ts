import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('GET /pokemon-cards', () => {
  it('Lister les pokemon avec statut 200', async () => {
    const pokemonsMock = [
      { id: 1, name: 'Bulbizarre', pokedexId: 1, typeId: 1, lifePoints: 45, size: 0.7, weight: 6.9, imageUrl: 'url' }];
    prismaMock.pokemonCard.findMany.mockResolvedValue(pokemonsMock as any);
    const response = await request(app).get('/pokemon-cards');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(pokemonsMock);
  });
});

describe('GET /pokemon-cards/:pokemonCardId', () => {
  it('Lister un pokemon spécifique avec statut 200', async () => {
    const mockCard = { id: 1, name: 'Bulbizarre', pokedexId: 1, typeId: 1, lifePoints: 45, size: 0.7, weight: 6.9, imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png' };
    prismaMock.pokemonCard.findUnique.mockResolvedValue(mockCard as any);
    const response = await request(app).get('/pokemon-cards/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCard);
  });
  it('retour 404 pokemon qui n existe pas', async () => {
    prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
    const response = await request(app).get('/pokemon-cards/999');
    expect(response.status).toBe(404);
  });
});

describe('POST /pokemon-cards', () => {
  it('Sans token 401', async () => {
    const response = await request(app).post('/pokemon-cards').send({ name: 'Pikachu' });
    expect(response.status).toBe(401);
  });

  it('Si token valide alors crée le poke', async () => {
    const newCard = { name: 'Pikachu', pokedexId: 25, typeId: 3, lifePoints: 35 };
    const createdCard = { id: 2, ...newCard, size: 0, weight: 0, imageUrl: null };
    prismaMock.type.findUnique.mockResolvedValue({ id: 3, name: 'Electrique' } as any);
    prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
    prismaMock.pokemonCard.create.mockResolvedValue(createdCard as any);
    const response = await request(app)
      .post('/pokemon-cards')
      .set('Authorization', 'Bearer mockedToken')
      .send(newCard);

    expect(response.status).toBe(201);
  });
});

describe('PATCH /pokemon-cards/:pokemonCardId', () => {
  it('modif du poke si token valide', async () => {
    const existingCard = { id: 1, name: 'Bulbizarre', pokedexId: 1, typeId: 1, lifePoints: 45 };
    const updatedCard = { ...existingCard, lifePoints: 50 };
    prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard as any);
    prismaMock.pokemonCard.update.mockResolvedValue(updatedCard as any);
    const response = await request(app)
      .patch('/pokemon-cards/1')
      .set('Authorization', 'Bearer mockedToken')
      .send({ lifePoints: 50 });

    expect(response.status).toBe(200);
  });

  it('retour 404 si on modifie un poke inexistant', async () => {
    prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
    const response = await request(app)
      .patch('/pokemon-cards/999')
      .set('Authorization', 'Bearer mockedToken')
      .send({ lifePoints: 50 });
    expect(response.status).toBe(404);
  });
});

describe('DELETE /pokemon-cards/:pokemonCardId', () => {
  it('supprimer un pokemon existant', async () => {
    const existingCard = { id: 1, name: 'Bulbizarre' };
    prismaMock.pokemonCard.findUnique.mockResolvedValue(existingCard as any);
    prismaMock.pokemonCard.delete.mockResolvedValue(existingCard as any);
    const response = await request(app)
      .delete('/pokemon-cards/1')
      .set('Authorization', 'Bearer mockedToken');
    expect(response.status).toBe(204);
  });
  it('retour 404 si on tente de supprimer un poke inexistant', async () => {
    prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
    const response = await request(app)
      .delete('/pokemon-cards/999')
      .set('Authorization', 'Bearer mockedToken');
    expect(response.status).toBe(404);
  });
});