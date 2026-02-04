import express from 'express';
import pokemonCardRouter from './pokemonCard.routes';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(pokemonCardRouter);

export const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export function stopServer() {
  server.close();
}
