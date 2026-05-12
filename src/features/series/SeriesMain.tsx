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
      <div className="absolute bottom-10 left-10 max-w-xl">
        <h1 className="text-6xl font-bold mb-4">{series.title}</h1>

        <p className="text-lg text-white mb-4">
          {series.genres.map((genre) => genre.name).join(", ")}
        </p>

        <p className="text-sm text-neutral-300 mb-4">
          {series.year} &#8226; {series.ratingAge} &#8226;{" "}
        </p>

        <p className="text-neutral-400 text-sm">{series.description}</p>
      </div>
    </section>
  );
}
