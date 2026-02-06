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


const getTypeId = async (name: string) => {
  const t = await prisma.type.findUnique({ where: { name } });
  if (!t) {
    throw new Error(`Type not found: ${name}`);
  }
  return t.id;
};

  await prisma.pokemonCard.create({
    data: {
      name: 'Bulbizarre',
      pokedexId: 1,
      typeId: await getTypeId('Grass'),
      lifePoints: 45,
      size: 0.7,
      weight: 6.9,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Salamèche',
      pokedexId: 4,
      typeId: await getTypeId('Fire'),
      lifePoints: 39,
      size: 0.6,
      weight: 8.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Carapuce',
      pokedexId: 7,
      typeId: await getTypeId('Water'),
      lifePoints: 44,
      size: 0.5,
      weight: 9.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Pikachu',
      pokedexId: 25,
      typeId: await getTypeId('Electric'),
      lifePoints: 35,
      size: 0.4,
      weight: 6.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Lipoutou',
      pokedexId: 124,
      typeId: await getTypeId('Ice'),
      lifePoints: 65,
      size: 1.4,
      weight: 40.6,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/124.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Machopeur',
      pokedexId: 67,
      typeId: await getTypeId('Fighting'),
      lifePoints: 80,
      size: 1.5,
      weight: 70.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/067.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Smogogo',
      pokedexId: 110,
      typeId: await getTypeId('Poison'),
      lifePoints: 65,
      size: 1.2,
      weight: 9.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/110.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Taupiqueur',
      pokedexId: 50,
      typeId: await getTypeId('Ground'),
      lifePoints: 10,
      size: 0.2,
      weight: 0.8,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/050.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Roucool',
      pokedexId: 16,
      typeId: await getTypeId('Flying'),
      lifePoints: 40,
      size: 0.3,
      weight: 1.8,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/016.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Abra',
      pokedexId: 63,
      typeId: await getTypeId('Psychic'),
      lifePoints: 25,
      size: 0.9,
      weight: 19.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/063.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Aspicot',
      pokedexId: 13,
      typeId: await getTypeId('Bug'),
      lifePoints: 40,
      size: 0.3,
      weight: 3.2,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/013.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Racaillou',
      pokedexId: 74,
      typeId: await getTypeId('Rock'),
      lifePoints: 40,
      size: 0.4,
      weight: 20.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/074.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Fantominus',
      pokedexId: 92,
      typeId: await getTypeId('Ghost'),
      lifePoints: 30,
      size: 1.3,
      weight: 0.1,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/092.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Minidraco',
      pokedexId: 147,
      typeId: await getTypeId('Dragon'),
      lifePoints: 41,
      size: 1.8,
      weight: 3.3,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/147.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Noctali',
      pokedexId: 197,
      typeId: await getTypeId('Dark'),
      lifePoints: 95,
      size: 1.0,
      weight: 27.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/197.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Magnéti',
      pokedexId: 81,
      typeId: await getTypeId('Steel'),
      lifePoints: 25,
      size: 0.3,
      weight: 6.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/081.png',
    },
  });
  await prisma.pokemonCard.create({
    data: {
      name: 'Togepi',
      pokedexId: 175,
      typeId: await getTypeId('Fairy'),
      lifePoints: 35,
      size: 0.3,
      weight: 1.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/175.png',
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