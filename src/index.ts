import express from 'express';
import pokemonCardRouter from './pokemonCard.routes';
import userRouter from './user.routes';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(pokemonCardRouter);
app.use(userRouter);

export let server: any;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export function stopServer() {
  if (server) {
  server.close();
  }
}
