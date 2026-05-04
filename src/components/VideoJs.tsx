import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

type TPlayer = ReturnType<typeof videojs>;

type TOptions = Parameters<typeof videojs>[1];

type TVideoJSProps = {
  options: TOptions;
  onReady?: (player: TPlayer) => void;
  className?: string;
};

export function VideoJS({ options, onReady, className }: TVideoJSProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<TPlayer | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!playerRef.current) {
      const el = document.createElement("video-js");
      el.classList.add("vjs-big-play-centered");
      root.appendChild(el);

      const player = (playerRef.current = videojs(el, options, () => {
        onReady?.(player);
      }));
    } else {
      const player = playerRef.current;
      player.autoplay(Boolean(options?.autoplay));
      if (options?.sources) player.src(options.sources);
    }
  }, [options, onReady]);

  useEffect(() => {
    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) player.dispose();
      playerRef.current = null;
    };
  }, []);

  return (
    <div data-vjs-player className={className}>
      <div ref={rootRef} />
    </div>
  );
}
