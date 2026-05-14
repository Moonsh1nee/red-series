import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const VIDEO_URL = "/demo.mp4";
const SHORT_DURATION = 10; // 10 секунд для демо-видео

async function main() {
  await prisma.episode.deleteMany();
  await prisma.season.deleteMany();
  await prisma.series.deleteMany();
  await prisma.genre.deleteMany();

  // ==================== GENRES ====================
  const sciFi = await prisma.genre.create({
    data: { name: "Sci-Fi", slug: "sci-fi" },
  });
  const fantasy = await prisma.genre.create({
    data: { name: "Fantasy", slug: "fantasy" },
  });
  const drama = await prisma.genre.create({
    data: { name: "Drama", slug: "drama" },
  });
  const thriller = await prisma.genre.create({
    data: { name: "Thriller", slug: "thriller" },
  });
  const action = await prisma.genre.create({
    data: { name: "Action", slug: "action" },
  });

  // ==================== SERIES ====================

  // 1. Stranger Things 5
  await prisma.series.create({
    data: {
      slug: "stranger-things-5",
      title: "Stranger Things 5",
      description: "Hawkins faces its final confrontation as the rift spreads.",
      year: 2026,
      ratingAge: "18+",
      imageUrl: "/images/st/hero-image.jpg",
      posterUrl: "/images/st/poster.jpg",
      genres: { connect: [{ id: sciFi.id }, { id: drama.id }] },
      seasons: {
        create: [
          {
            number: 1,
            title: "Season 1",
            episodes: {
              create: Array.from({ length: 8 }, (_, i) => ({
                number: i + 1,
                title: `Chapter ${i + 1}`,
                videoUrl: VIDEO_URL,
                durationSec: SHORT_DURATION,
                thumbnailUrl: `/images/st/ep${i + 1}.jpg`,
              })),
            },
          },
        ],
      },
    },
  });

  // 2. The Witcher
  await prisma.series.create({
    data: {
      slug: "the-witcher",
      title: "The Witcher",
      description:
        "Geralt of Rivia, a mutated monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
      year: 2019,
      ratingAge: "18+",
      imageUrl: "/images/witcher/hero-image.jpg",
      posterUrl: "/images/witcher/poster.jpg",
      genres: { connect: { id: fantasy.id } },
      seasons: {
        create: [
          {
            number: 1,
            title: "Season 1",
            episodes: {
              create: Array.from({ length: 8 }, (_, i) => ({
                number: i + 1,
                title: `Episode ${i + 1}`,
                videoUrl: VIDEO_URL,
                durationSec: SHORT_DURATION,
                thumbnailUrl: `/images/witcher/s1e${i + 1}.jpg`,
              })),
            },
          },
        ],
      },
    },
  });

  // 3. The Boys (много эпизодов в сезоне)
  await prisma.series.create({
    data: {
      slug: "the-boys",
      title: "The Boys",
      description:
        "A group of vigilantes set out to take down corrupt superheroes with no more than blue-collar grit.",
      year: 2019,
      ratingAge: "18+",
      imageUrl: "/images/boys/hero-image.jpg",
      posterUrl: "/images/boys/poster.jpg",
      genres: { connect: [{ id: action.id }, { id: thriller.id }] },
      seasons: {
        create: [
          {
            number: 1,
            title: "Season 1",
            episodes: {
              create: Array.from({ length: 16 }, (_, i) => ({
                number: i + 1,
                title: `Episode ${i + 1}`,
                videoUrl: VIDEO_URL,
                durationSec: SHORT_DURATION,
                thumbnailUrl: `/images/boys/s1e${i + 1}.jpg`,
              })),
            },
          },
          {
            number: 2,
            title: "Season 2",
            episodes: {
              create: Array.from({ length: 8 }, (_, i) => ({
                number: i + 1,
                title: `Episode ${i + 1}`,
                videoUrl: VIDEO_URL,
                durationSec: SHORT_DURATION,
                thumbnailUrl: `/images/boys/s2e${i + 1}.jpg`,
              })),
            },
          },
          {
            number: 3,
            title: "Season 3",
            episodes: {
              create: Array.from({ length: 8 }, (_, i) => ({
                number: i + 1,
                title: `Episode ${i + 1}`,
                videoUrl: VIDEO_URL,
                durationSec: SHORT_DURATION,
                thumbnailUrl: `/images/boys/s3e${i + 1}.jpg`,
              })),
            },
          },
        ],
      },
    },
  });

  // 4. House of the Dragon
  await prisma.series.create({
    data: {
      slug: "house-of-the-dragon",
      title: "House of the Dragon",
      description:
        "The Targaryen civil war that took place about 200 years before events portrayed in 'Game of Thrones'.",
      year: 2022,
      ratingAge: "18+",
      imageUrl: "/images/hotd/hero-image.jpg",
      posterUrl: "/images/hotd/poster.jpg",
      genres: { connect: { id: fantasy.id } },
      seasons: {
        create: [
          {
            number: 1,
            title: "Season 1",
            episodes: {
              create: Array.from({ length: 10 }, (_, i) => ({
                number: i + 1,
                title: `Episode ${i + 1}`,
                videoUrl: VIDEO_URL,
                durationSec: SHORT_DURATION,
                thumbnailUrl: `/images/hotd/s1e${i + 1}.jpg`,
              })),
            },
          },
          {
            number: 2,
            title: "Season 2",
            episodes: {
              create: Array.from({ length: 8 }, (_, i) => ({
                number: i + 1,
                title: `Episode ${i + 1}`,
                videoUrl: VIDEO_URL,
                durationSec: SHORT_DURATION,
                thumbnailUrl: `/images/hotd/s2e${i + 1}.jpg`,
              })),
            },
          },
        ],
      },
    },
  });

  // 5. Arcane (для разнообразия)
  await prisma.series.create({
    data: {
      slug: "arcane",
      title: "Arcane",
      description:
        "The origins of two iconic League of Legends champions are revealed.",
      year: 2021,
      ratingAge: "16+",
      imageUrl: "/images/arcane/hero-image.jpg",
      posterUrl: "/images/arcane/poster.jpg",
      genres: { connect: [{ id: fantasy.id }, { id: action.id }] },
      seasons: {
        create: [
          {
            number: 1,
            title: "Season 1",
            episodes: {
              create: Array.from({ length: 9 }, (_, i) => ({
                number: i + 1,
                title: `Episode ${i + 1}`,
                videoUrl: VIDEO_URL,
                durationSec: SHORT_DURATION,
                thumbnailUrl: `/images/arcane/s1e${i + 1}.jpg`,
              })),
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeding completed with 5 series!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
