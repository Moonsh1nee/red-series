"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui-shadcn/dialog";
import { VideoJS } from "@/components/VideoJs";
import { useRouter, useSearchParams } from "next/navigation";

type TEpisode = {
  title: string;
  videoUrl: string;
  number: number;
};

export function VideoModal({
  episode,
  seriesSlug,
}: {
  episode: TEpisode;
  seriesSlug: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("ep");
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?", { scroll: false });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-7xl p-0 bg-black border-none">
        <DialogTitle className="sr-only">{episode.title}</DialogTitle>

        <VideoJS
          options={{
            controls: true,
            responsive: true,
            fluid: true,
            sources: [
              {
                src: episode.videoUrl,
                type: "video/mp4",
              },
            ],
          }}
          onReady={(player) => {
            player.currentTime(20);

            const key = `progress:${seriesSlug}:${episode.number}`;
            const savedTime = localStorage.getItem(key);

            if (savedTime) {
              player.currentTime(parseFloat(savedTime));
            }

            player.on("timeupdate", () => {
              const currentTime = player.currentTime();
              localStorage.setItem(key, String(currentTime));
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
