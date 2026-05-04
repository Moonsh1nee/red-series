import { Genre, Series } from "@prisma/generated/prisma/client";
import Image from "next/image";

type TProps = {
  series: Series & {
    genres: Genre[];
  };
};

export function SeriesMain({ series }: TProps) {
  return (
    <section className="relative h-[70vh] w-full">
      <Image
        src={series.imageUrl}
        alt={series.title}
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

      <div className="absolute bottom-10 left-10 max-w-xl">
        <h1 className="text-4xl font-bold mb-4">{series.title}</h1>

        <p className="text-sm text-neutral-300 mb-4">
          {series.year} &#8226; {series.ratingAge} &#8226;{" "}
          {series.genres.map((genre) => genre.name).join(", ")}
        </p>

        <p className="text-neutral-400 text-sm">{series.description}</p>
      </div>
    </section>
  );
}
