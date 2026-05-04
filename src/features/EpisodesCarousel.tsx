"use client";

import { Episode } from "@prisma/generated/prisma/client";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter, useSearchParams } from "next/navigation";

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

  const getEpisodeProgress = (
    epNumber: number,
    durationSec: number,
  ): number => {
    if (typeof window === "undefined" || !durationSec || durationSec <= 0) {
      return 0;
    }

    const key = `progress:${series.slug}:${epNumber}`;
    const savedTime = localStorage.getItem(key);

    if (!savedTime) return 0;

    const time = parseFloat(savedTime);
    if (isNaN(time) || time <= 0) return 0;

    const progress = (time / durationSec) * 100;

    return Math.min(Math.max(progress, 0), 99);
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
              {(() => {
                const progress = getEpisodeProgress(
                  episode.number,
                  episode.durationSec,
                );
                if (progress <= 0) return null;

                return (
                  <div
                    suppressHydrationWarning
                    className="absolute bottom-2 left-2 right-2 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-red-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(progress, 1)}%` }}
                    />
                  </div>
                );
              })()}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
