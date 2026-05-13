import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const VIDEO_URL = "/demo.mp4";

async function main() {
  await prisma.episode.deleteMany();
  await prisma.season.deleteMany();
  await prisma.series.deleteMany();
  await prisma.genre.deleteMany();

  // Genres
  const sciFi = await prisma.genre.create({ data: { name: "Sci-Fi", slug: "sci-fi" } });
  const fantasy = await prisma.genre.create({ data: { name: "Fantasy", slug: "fantasy" } });

  // === Stranger Things 5 ===
  const st = await prisma.series.create({
    data: {
      slug: "stranger-things-5",
      title: "Stranger Things 5",
      description: "Hawkins faces its final confrontation as the rift spreads.",
      year: 2026,
      ratingAge: "18+",
      imageUrl: "/images/st/hero-image.jpg",
      posterUrl: "/images/st/poster.jpg",
      genres: { connect: { id: sciFi.id } },
      seasons: {
        create: [
          {
            number: 1,
            title: "Season 1",
            episodes: {
              create: [
                { number: 1, title: "The Rift", videoUrl: VIDEO_URL, durationSec: 3600, thumbnailUrl: "/images/st/ep1.jpg" },
                { number: 2, title: "The Final Battle", videoUrl: VIDEO_URL, durationSec: 4200, thumbnailUrl: "/images/st/ep2.jpg" },
                { number: 3, title: "The Aftermath", videoUrl: VIDEO_URL, durationSec: 3800, thumbnailUrl: "/images/st/ep3.jpg" },
              ],
            },
          },
          {
            number: 2,
            title: "Season 2",
            episodes: {
              create: [
                { number: 1, title: "The Return", videoUrl: VIDEO_URL, durationSec: 4100, thumbnailUrl: "/images/st/s2ep1.jpg" },
                { number: 2, title: "New Threats", videoUrl: VIDEO_URL, durationSec: 4500, thumbnailUrl: "/images/st/s2ep2.jpg" },
              ],
            },
          },
        ],
      },
    },
  });

  // === The Witcher ===
  await prisma.series.create({
    data: {
      slug: "the-witcher",
      title: "The Witcher",
      description: "Geralt of Rivia, a mutated monster hunter, struggles to find his place...",
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
              create: [
                { number: 1, title: "The End's Beginning", videoUrl: VIDEO_URL, durationSec: 3500, thumbnailUrl: "/images/witcher/s1e1.jpg" },
                { number: 2, title: "Four Marks", videoUrl: VIDEO_URL, durationSec: 3200, thumbnailUrl: "/images/witcher/s1e2.jpg" },
                { number: 3, title: "Betrayer Moon", videoUrl: VIDEO_URL, durationSec: 3400, thumbnailUrl: "/images/witcher/s1e3.jpg" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeding completed!");
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