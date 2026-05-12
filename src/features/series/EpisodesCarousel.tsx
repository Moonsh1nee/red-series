"use client";

import { Episode } from "@prisma/generated/prisma/client";
import useEmblaCarousel from "embla-carousel-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
const DynamicProgressBar = dynamic(
  () => import("./ProgressBar").then((mod) => mod.ProgressBar),
  { ssr: false },
);
type TSeries = {
  posterUrl: string;
  episodes: Episode[];
  slug: string;
};

export function EpisodesCarousel({ series }: { series: TSeries }) {
  const [emblaRef] = useEmblaCarousel({ align: "start" });
  const router = useRouter();
  const searchParams = useSearchParams();

  const openEpisode = (number: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ep", String(number));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="px-10 py-10">
      <h2 className="text-lg font-semibold mb-6">Episodes</h2>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {series.episodes.map((episode) => (
            <button
              key={episode.id}
              className="relative w-40 aspect-video shrink-0 rounded-md overflow-hidden"
              onClick={() => openEpisode(episode.number)}
              style={{
                backgroundImage: `url(${episode.thumbnailUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-bold text-xl">
                {episode.number}
              </div>
              <DynamicProgressBar episode={episode} series={series} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
