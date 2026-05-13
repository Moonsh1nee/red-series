import prisma from "@/lib/prisma/prisma";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RED Series",
  description: "Discover the latest and greatest series on RED Series.",
};

export const revalidate = 60;

export default async function Home() {
  const series = await prisma.series.findMany({
    include: {
      genres: true,
      seasons: {
        include: {
          episodes: true,
        },
        orderBy: {
          number: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <header className="mb-12 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-wide text-red-500">
          RED Series
        </h1>
        <p className="text-neutral-400">Latest Releases</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {series.map((item) => {
          const totalSeasons = item.seasons.length;
          const totalEpisodes = item.seasons.reduce(
            (sum, season) => sum + season.episodes.length,
            0,
          );

          return (
            <Link key={item.id} href={`/series/${item.slug}`} className="group">
              <div className="relative aspect-2/3 overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={item.posterUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              <div className="mt-4 space-y-1">
                <h2 className="text-lg font-semibold line-clamp-2 group-hover:text-red-500 transition-colors">
                  {item.title}
                </h2>

                <p className="text-sm text-neutral-400">
                  {item.year} • {item.genres.map((g) => g.name).join(", ")}
                </p>

                {totalSeasons > 0 && (
                  <p className="text-xs text-neutral-500">
                    {totalSeasons} season{totalSeasons > 1 ? "s" : ""} •{" "}
                    {totalEpisodes} episodes
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
