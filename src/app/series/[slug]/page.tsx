import { EpisodesCarousel } from "@/features/series/EpisodesCarousel";
import { SeriesMain } from "@/features/series/SeriesMain";
import { VideoModal } from "@/features/series/VideoModal";
import prisma from "@/lib/prisma/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type TParams = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ep?: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: TParams): Promise<Metadata> {
  const resolvedParams = await params;

  const series = await prisma.series.findUnique({
    where: { slug: resolvedParams.slug },
    select: { title: true, description: true, imageUrl: true, slug: true },
  });

  if (!series) return {};

  const url = `http://localhost:3000/series/${series.slug}`;

  return {
    title: series.title,
    description: series.description,
    alternates: { canonical: url },
    openGraph: {
      title: series.title,
      description: series.description,
      url,
      siteName: "RED Series",
      type: "video.tv_show",
      images: [{ url: series.imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: series.title,
      description: series.description,
      images: [series.imageUrl],
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const series = await prisma.series.findMany({ select: { slug: true } });
  return series.map((s) => ({ slug: s.slug }));
}

export default async function SeriesPage({ params, searchParams }: TParams) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const series = await prisma.series.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      genres: true,
      seasons: {
        include: {
          episodes: {
            orderBy: { number: "asc" },
          },
        },
        orderBy: { number: "asc" },
      },
    },
  });

  if (!series) notFound();

  const activeEpisode = resolvedSearchParams.ep
    ? series.seasons
        .flatMap((season) => season.episodes)
        .find((ep) => ep.number === parseInt(resolvedSearchParams.ep!, 10))
    : null;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Hero Background */}
      <Image
        src={series.imageUrl}
        alt={series.title}
        fill
        priority
        className="object-cover absolute"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />

      <SeriesMain series={series} />

      <EpisodesCarousel series={series} />

      {/* Video Modal */}
      {activeEpisode && (
        <VideoModal episode={activeEpisode} seriesSlug={series.slug} />
      )}
    </main>
  );
}
