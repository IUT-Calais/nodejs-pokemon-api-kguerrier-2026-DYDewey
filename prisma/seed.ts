import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemonCard.deleteMany();
  await prisma.user.deleteMany();
  await prisma.type.deleteMany();

  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });


await prisma.pokemonCard.createMany({
  data: [
    {
      name: 'Bulbizarre',
      pokedexId: 1,
      typeId: 4, 
      lifePoints: 45,
      size: 0.7,
      weight: 6.9,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
    },
    {
      name: 'Salamèche',
      pokedexId: 4,
      typeId: 2,
      lifePoints: 39,
      size: 0.6,
      weight: 8.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png',
    },
    {
      name: 'Carapuce',
      pokedexId: 7,
      typeId: 3,
      lifePoints: 44,
      size: 0.5,
      weight: 9.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png',
    },
  ],
});

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
