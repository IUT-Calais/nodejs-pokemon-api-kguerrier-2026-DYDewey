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

  const fireType = await prisma.type.findFirst({ where: { name: 'Fire' } });
  const grassType = await prisma.type.findFirst({ where: { name: 'Grass' } });
  const waterType = await prisma.type.findFirst({ where: { name: 'Water' } });


  if (!fireType || !grassType || !waterType) {
    throw new Error('Type pas trouvé');
  }

  await prisma.pokemonCard.createMany({
    data: [
      {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: grassType.id,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl:
          'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      },
      {
        name: 'Salamèche',
        pokedexId: 4,
        typeId: fireType.id,
        lifePoints: 39,
        size: 0.6,
        weight: 8.5,
        imageUrl:
          'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png',
      },
      {
        name: 'Carapuce',
        pokedexId: 7,
        typeId: waterType.id,
        lifePoints: 44,
        size: 0.5,
        weight: 9.0,
        imageUrl:
          'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png',
      },
    ],
  });

  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: 'admin',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
