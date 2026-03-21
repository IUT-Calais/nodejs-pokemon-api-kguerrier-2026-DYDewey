import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('GET /pokemon-cards', () => {
  it('Lister les pokemon avec statut 200', async () => {
    const pokemonsMock = [
      { id: 1, name: 'Bulbizarre', pokedexId: 1, typeId: 1, lifePoints: 45, size: 0.7, weight: 6.9, imageUrl: 'url' }
    ];
    prismaMock.pokemonCard.findMany.mockResolvedValue(pokemonsMock as any);
    const response = await request(app).get('/pokemon-cards');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(pokemonsMock);
  });

  it('500 en cas d erreur BDD', async () => {
    prismaMock.pokemonCard.findMany.mockRejectedValue(new Error('Erreur serveur'));
    const response = await request(app).get('/pokemon-cards');
    expect(response.status).toBe(500);
  });
});

describe('GET /pokemon-cards/:pokemonCardId', () => {
  it('Lister un pokemon spécifique avec statut 200', async () => {
    const mockCard = { id: 1, name: 'Bulbizarre', pokedexId: 1, typeId: 1, lifePoints: 45, size: 0.7, weight: 6.9, imageUrl: 'url' };
    prismaMock.pokemonCard.findUnique.mockResolvedValue(mockCard as any);
    const response = await request(app).get('/pokemon-cards/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCard);
  });
  it('404 pokemon qui n existe pas', async () => {
    prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
    const response = await request(app).get('/pokemon-cards/999');
    expect(response.status).toBe(404);
  });
  it('400 si l id nest pas un nombre', async () => {
    const response = await request(app).get('/pokemon-cards/toto');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid id' });
  });
  it('500 en cas d erreur BDD', async () => {
    prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Erreur BDD'));
    const response = await request(app).get('/pokemon-cards/1');
    expect(response.status).toBe(500);
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
  it('400 si le nom est manquant', async () => {
    const response = await request(app).post('/pokemon-cards').set('Authorization', 'Bearer mockedToken')
      .send({ pokedexId: 25, typeId: 3, lifePoints: 35 }); 
    expect(response.status).toBe(400);
  });

  it('400 si pokedexId, typeId ou lifePoints sont manquants', async () => {
    let res = await request(app).post('/pokemon-cards').set('Authorization', 'Bearer mockedToken').send({ name: 'A', typeId: 1, lifePoints: 10 });
    expect(res.status).toBe(400);
    res = await request(app).post('/pokemon-cards').set('Authorization', 'Bearer mockedToken').send({ name: 'A', pokedexId: 1, lifePoints: 10 });
    expect(res.status).toBe(400);
    res = await request(app).post('/pokemon-cards').set('Authorization', 'Bearer mockedToken').send({ name: 'A', pokedexId: 1, typeId: 1 });
    expect(res.status).toBe(400);
  });
  it('400 si le type n existe pas en BDD', async () => {
    prismaMock.type.findUnique.mockResolvedValue(null);
    const response = await request(app).post('/pokemon-cards').set('Authorization', 'Bearer mockedToken')
      .send({ name: 'Inconnu', pokedexId: 99, typeId: 99, lifePoints: 10 });
    expect(response.status).toBe(400);
  });
  it('400 si le nom existe déjà en BDD', async () => {
    prismaMock.type.findUnique.mockResolvedValue({ id: 1 } as any);
    prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({ id: 1 } as any);
    const response = await request(app).post('/pokemon-cards').set('Authorization', 'Bearer mockedToken')
      .send({ name: 'Bulbizarre', pokedexId: 99, typeId: 1, lifePoints: 10 });
    expect(response.status).toBe(400);
  });
  it('400 si le pokedexId existe déjà en BDD', async () => {
    prismaMock.type.findUnique.mockResolvedValue({ id: 1 } as any);
    prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 1 } as any);
    const response = await request(app).post('/pokemon-cards').set('Authorization', 'Bearer mockedToken')
      .send({ name: 'Nouveau', pokedexId: 1, typeId: 1, lifePoints: 10 });
    expect(response.status).toBe(400);
  });
  it('500 en cas d erreur serveur', async () => {
    prismaMock.type.findUnique.mockResolvedValue({ id: 1 } as any);
    prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Crash BDD'));
    const response = await request(app).post('/pokemon-cards').set('Authorization', 'Bearer mockedToken')
      .send({ name: 'Test', pokedexId: 1, typeId: 1, lifePoints: 10 });
    expect(response.status).toBe(500);
  });
});

describe('PATCH /pokemon-cards/:pokemonCardId', () => {
  it('modif du poke si token valide', async () => {
    const existingCard = { id: 1, name: 'Bulbizarre', pokedexId: 1, typeId: 1, lifePoints: 45 };
    prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(existingCard as any);
    prismaMock.pokemonCard.update.mockResolvedValue({ ...existingCard, lifePoints: 50 } as any);
    const response = await request(app).patch('/pokemon-cards/1').set('Authorization', 'Bearer mockedToken').send({ lifePoints: 50 });
    expect(response.status).toBe(200);
  });
  it('404 si on modifie un poke inexistant', async () => {
    prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
    const response = await request(app).patch('/pokemon-cards/999').set('Authorization', 'Bearer mockedToken').send({ lifePoints: 50 });
    expect(response.status).toBe(404);
  });
  it('400 pour un ID invalide (non-numérique)', async () => {
    const response = await request(app).patch('/pokemon-cards/abc').set('Authorization', 'Bearer mockedToken').send({ lifePoints: 50 });
    expect(response.status).toBe(400);
  });
  it('400 si on essaie de mettre un nom déjà existant', async () => {
    prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({ id: 2 } as any); 
    prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({ id: 1 } as any); 
    const response = await request(app).patch('/pokemon-cards/2').set('Authorization', 'Bearer mockedToken').send({ name: 'Bulbizarre' });
    expect(response.status).toBe(400);
  });
  it('400 si on essaie de mettre un type invalide', async () => {
    // La carte existe
    prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({ id: 1 } as any);
    // Mais le type n'existe pas
    prismaMock.type.findUnique.mockResolvedValue(null);
    
    const res = await request(app).patch('/pokemon-cards/1').set('Authorization', 'Bearer mockedToken').send({ typeId: 99 });
    expect(res.status).toBe(400);
  });
  it('400 si on essaie de mettre un pokedexId existant', async () => {
    prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({ id: 1 } as any);
    prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({ id: 2, pokedexId: 5 } as any);
    
    const res = await request(app).patch('/pokemon-cards/1').set('Authorization', 'Bearer mockedToken').send({ pokedexId: 5 });
    expect(res.status).toBe(400);
  });
  it('500 en cas d erreur serveur', async () => {
    prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Erreur BDD'));
    const response = await request(app).patch('/pokemon-cards/1').set('Authorization', 'Bearer mockedToken').send({ lifePoints: 50 });
    expect(response.status).toBe(500);
  });
});

describe('DELETE /pokemon-cards/:pokemonCardId', () => {
  it('supprimer un pokemon existant', async () => {
    const existingCard = { id: 1, name: 'Bulbizarre' };
    prismaMock.pokemonCard.findUnique.mockResolvedValue(existingCard as any);
    prismaMock.pokemonCard.delete.mockResolvedValue(existingCard as any);
    const response = await request(app).delete('/pokemon-cards/1').set('Authorization', 'Bearer mockedToken');
    expect(response.status).toBe(204);
  });
  it('retour 404 si on tente de supprimer un poke inexistant', async () => {
    prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
    const response = await request(app).delete('/pokemon-cards/999').set('Authorization', 'Bearer mockedToken');
    expect(response.status).toBe(404);
  });
  it('401 si le token est manquant', async () => {
    const response = await request(app).delete('/pokemon-cards/1');
    expect(response.status).toBe(401);
  });
  it('400 si l id nest pas un nombre', async () => {
    const response = await request(app).delete('/pokemon-cards/lettres').set('Authorization', 'Bearer mockedToken');
    expect(response.status).toBe(400);
  });
  it('500 en cas de problème de serveur', async () => {
    prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Crash réseau'));
    const response = await request(app).delete('/pokemon-cards/1').set('Authorization', 'Bearer mockedToken');
    expect(response.status).toBe(500);
  });
});