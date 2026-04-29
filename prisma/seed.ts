import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const VIDEO_URL = "/demo.mp4";

async function main() {
  await prisma.episode.deleteMany();
  await prisma.series.deleteMany();
  await prisma.genre.deleteMany();

  const sciFi = await prisma.genre.create({
    data: {
      name: "Sci-Fi",
      slug: "sci-fi",
    },
  });

  const fantasy = await prisma.genre.create({
    data: {
      name: "Fantasy",
      slug: "fantasy",
    },
  });

  await prisma.series.create({
    data: {
      slug: "stranger-things-5",
      title: "Stranger Things 5",
      description:
        "A suspens-drama series. Hawkins faces its final confrontation as the rift spreads.",
      year: 2026,
      ratingAge: "18+",
      imageUrl: "/images/st/hero-image.jpg",
      posterUrl: "/images/st/poster.jpg",
      genres: {
        connect: { id: sciFi.id },
      },
      episodes: {
        create: [
          {
            number: 1,
            title: "The Rift",
            videoUrl: VIDEO_URL,
            durationSec: 3600,
            thumbnailUrl: "/images/st/st_ep_5_s_1.jpg",
          },
          {
            number: 2,
            title: "The Final Battle",
            videoUrl: VIDEO_URL,
            durationSec: 4200,
            thumbnailUrl: "/images/st/st_ep_5_s_2.jpg",
          },
          {
            number: 3,
            title: "The Aftermath",
            videoUrl: VIDEO_URL,
            durationSec: 6000,
            thumbnailUrl: "/images/st/st_ep_5_s_3.jpg",
          },
          {
            number: 4,
            title: "The Resolution",
            videoUrl: VIDEO_URL,
            durationSec: 4800,
            thumbnailUrl: "/images/st/st_ep_5_s_4.jpg",
          },
          {
            number: 5,
            title: "The New Beginning",
            videoUrl: VIDEO_URL,
            durationSec: 5400,
            thumbnailUrl: "/images/st/st_ep_5_s_5.jpg",
          },
        ],
      },
    },
  });

  await prisma.series.create({
    data: {
      slug: "the-witcher-3",
      title: "The Witcher 3",
      description:
        "Geralt of Rivia, a monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
      year: 2019,
      ratingAge: "18+",
      imageUrl: "/images/w3/hero-image.jpg",
      posterUrl: "/images/w3/poster.jpg",
      genres: {
        connect: { id: fantasy.id },
      },
      episodes: {
        create: [
          {
            number: 1,
            title: "The End's Beginning",
            videoUrl: VIDEO_URL,
            durationSec: 3600,
            thumbnailUrl: "/images/w3/w3_ep_1_s_1.jpg",
          },
          {
            number: 2,
            title: "Four Marks",
            videoUrl: VIDEO_URL,
            durationSec: 2700,
            thumbnailUrl: "/images/w3/w3_ep_1_s_2.jpg",
          },
          {
            number: 3,
            title: "Betrayer Moon",
            videoUrl: VIDEO_URL,
            durationSec: 3000,
            thumbnailUrl: "/images/w3/w3_ep_1_s_3.jpg",
          },
        ],
      },
    },
  });
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
