"use client";

import { Episode, Season } from "@prisma/generated/prisma/client";
import useEmblaCarousel from "embla-carousel-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ProgressBar = dynamic(
  () => import("./ProgressBar").then((mod) => mod.ProgressBar),
  { ssr: false },
);

type TSeries = {
  slug: string;
  seasons: (Season & {
    episodes: Episode[];
  })[];
};

export function EpisodesCarousel({ series }: { series: TSeries }) {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0);

  console.log("EpisodesCarousel rendered with series:", series.seasons);

  const currentSeason = series.seasons[activeSeasonIndex];
  const episodes = currentSeason?.episodes || [];

  const openEpisode = (episodeNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ep", String(episodeNumber));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="px-6 md:px-10 py-12 relative">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-2xl font-semibold">Episodes</h2>

        {/* Season Selector */}
        {series.seasons.length > 1 && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-400">Season</span>
            <div className="flex bg-white/10 rounded-full p-1">
              {series.seasons.map((season, index) => (
                <button
                  key={season.id}
                  onClick={() => setActiveSeasonIndex(index)}
                  className={`px-5 py-1.5 rounded-full font-medium transition-all ${
                    index === activeSeasonIndex
                      ? "bg-red-600 text-white shadow"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  {season.number}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Season Title */}
      {currentSeason && (
        <p className="text-neutral-400 mb-6 text-lg">
          {currentSeason.title || `Season ${currentSeason.number}`}
        </p>
      )}

      {/* Episodes Grid/Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pb-8">
          {episodes.map((episode) => (
            <button
              key={episode.id}
              onClick={() => openEpisode(episode.number)}
              className="relative w-40 md:w-52 aspect-video shrink-0 rounded-xl overflow-hidden group shadow-xl"
              style={{
                backgroundImage: `url(${episode.thumbnailUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-5xl font-bold text-white/90 drop-shadow-2xl">
                  {episode.number}
                </span>
              </div>

              <ProgressBar episode={episode} series={{ slug: series.slug }} />

              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-md">
                  {episode.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
