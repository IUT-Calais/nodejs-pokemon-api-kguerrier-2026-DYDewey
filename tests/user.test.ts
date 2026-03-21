import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';
import bcrypt from 'bcrypt';

describe('POST /users', () => {
  it('créer un utilisateur', async () => {
    const newUser = { email: 'test@gmail.com', password: 'password123' };
    const createdUser = { id: 1, email: newUser.email, password: 'hashed' };
    
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(createdUser as any);

    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, email: newUser.email });
  });
  it('400 si l email est manquant', async () => {
    const response = await request(app).post('/users').send({ password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'email obligatoire' });
  });
  it('400 si le mot de passe est manquant', async () => {
    const response = await request(app).post('/users').send({ email: 'test@gmail.com' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'mot de passe obligatoire' });
  });
  it('400 si l email est déjà pris', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'test@gmail.com' } as any);
    const response = await request(app).post('/users').send({ email: 'test@gmail.com', password: '123' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'email déjà utilisé' });
  });
  it('500 en cas d erreur serveur (catch)', async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error('Crash BDD'));
    
    const response = await request(app).post('/users').send({ email: 'crash@gmail.com', password: '123' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'erreur serveur' });
  });
});

describe('POST /users/login', () => {
  it('connecter l utilisateur', async () => {
    const mockUser = { id: 1, email: 'admin@gmail.com', password: 'hashedPassword' };
    prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
    const response = await request(app).post('/users/login').send({ email: 'admin@gmail.com', password: 'truePassword' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
  it('400 si email ou password est manquant', async () => {
    let res = await request(app).post('/users/login').send({ email: 'admin@gmail.com' });
    expect(res.status).toBe(400);

    res = await request(app).post('/users/login').send({ password: '123' });
    expect(res.status).toBe(400);
  });
  it('404 si l utilisateur n existe pas', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const response = await request(app).post('/users/login').send({ email: 'inconnu@gmail.com', password: '123' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'utilisateur introuvable' });
  });
  it('400 si le mot de passe est incorrect', async () => {
    const mockUser = { id: 1, email: 'admin@gmail.com', password: 'hashedPassword' };
    prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
    const response = await request(app).post('/users/login').send({ email: 'admin@gmail.com', password: 'wrongPassword' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'mot de passe incorrect' });
  });

  it('500 en cas d erreur serveur (catch)', async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error('Crash BDD'));
    const response = await request(app).post('/users/login').send({ email: 'crash@gmail.com', password: '123' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'erreur serveur' });
  });
});