import prisma from "@/lib/prisma/prisma";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const series = await prisma.series.findMany({
    include: {
      genres: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <header className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-wide text-red-500">
          RED Series
        </h1>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {series.map((item) => (
          <Link key={item.id} href={`/series/${item.slug}`} className="group">
            <div className="relative aspect-2/3 overflow-hidden rounded-lg">
              <Image
                src={item.posterUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h2 className="mt-3 text-sm font-mono font-semibold">
              {item.title}
            </h2>

            <p className="text-neutral-400 text-xs ">
              {item.year} &bull; {item.genres.map((g) => g.name).join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
