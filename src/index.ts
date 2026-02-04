import express from 'express';
import pokemonCardRouter from './pokemonCard.routes';
import userRouter from './user.routes';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(pokemonCardRouter);
app.use(userRouter);

export const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export function stopServer() {
  server.close();
}
