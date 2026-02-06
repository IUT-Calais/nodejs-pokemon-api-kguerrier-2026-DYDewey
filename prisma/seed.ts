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
    {
      name: 'Pikachu',
      pokedexId: 25,
      typeId: 5,
      lifePoints: 35,
      size: 0.4,
      weight: 6.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
    },
    {
      name: 'Lipoutou', 
      pokedexId: 124,
      typeId: 6, 
      lifePoints: 65,
      size: 1.4,
      weight: 40.6,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/124.png',
    },
    {
      name: 'Machopeur',
      pokedexId: 67,
      typeId: 7,
      lifePoints: 80,
      size: 1.5,
      weight: 70.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/067.png',
    },
    {
      name: 'Smogogo',
      pokedexId: 110,
      typeId: 8, 
      lifePoints: 65,
      size: 1.2,
      weight: 9.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/110.png',
    },
    {
      name: 'Taupiqueur',
      pokedexId: 50,
      typeId: 9, 
      lifePoints: 10,
      size: 0.2,
      weight: 0.8,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/050.png',
    },
    {
      name: 'Roucool',
      pokedexId: 16,
      typeId: 10, 
      lifePoints: 40,
      size: 0.3,
      weight: 1.8,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/016.png',
    },
    {
      name: 'Abra',
      pokedexId: 63,
      typeId: 11, 
      lifePoints: 25,
      size: 0.9,
      weight: 19.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/063.png',
    },
    {
      name: 'Aspicot',
      pokedexId: 13,
      typeId: 12,
      lifePoints: 40,
      size: 0.3,
      weight: 3.2,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/013.png',
    },
    {
      name: 'Racaillou',
      pokedexId: 74,
      typeId: 13,
      lifePoints: 40,
      size: 0.4,
      weight: 20.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/074.png',
    },
    {
      name: 'Fantominus',
      pokedexId: 92,
      typeId: 14,
      lifePoints: 30,
      size: 1.3,
      weight: 0.1,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/092.png',
    },
    {
      name: 'Minidraco',
      pokedexId: 147,
      typeId: 15, 
      lifePoints: 41,
      size: 1.8,
      weight: 3.3,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/147.png',
    },
    {
      name: 'Noctali',
      pokedexId: 197,
      typeId: 16,
      lifePoints: 95,
      size: 1.0,
      weight: 27.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/197.png',
    },
    {
      name: 'Magnéti',
      pokedexId: 81,
      typeId: 17,
      lifePoints: 25,
      size: 0.3,
      weight: 6.0,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/081.png',
    },
    {
      name: 'Togepi',
      pokedexId: 175,
      typeId: 18, 
      lifePoints: 35,
      size: 0.3,
      weight: 1.5,
      imageUrl:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/175.png',
    },
  ],
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

