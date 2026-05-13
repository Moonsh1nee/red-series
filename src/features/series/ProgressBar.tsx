export function ProgressBar({
  episode,
  series,
}: {
  episode: { number: number; durationSec: number };
  series: { slug: string };
}) {
  const getEpisodeProgress = (
    epNumber: number,
    durationSec: number,
  ): number => {
    if (typeof window === "undefined" || !durationSec || durationSec <= 0)
      return 0;

    const key = `progress:${series.slug}:${epNumber}`;
    const savedTime = localStorage.getItem(key);
    if (!savedTime) return 0;

    const time = parseFloat(savedTime);
    if (isNaN(time) || time <= 0) return 0;

    const progress = (time / durationSec) * 100;
    return Math.min(Math.max(progress, 0), 99);
  };

  const progress = getEpisodeProgress(episode.number, episode.durationSec);

  return (
    <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/30 rounded-full overflow-hidden">
      {progress > 0 && (
        <div
          className="h-full bg-red-600 rounded-full transition-all duration-300"
          style={{ width: `${Math.max(progress, 1)}%` }}
        />
      )}
    </div>
  );
}
