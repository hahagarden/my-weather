import type { MetadataRoute } from "next";

import { regionRepo } from "@/entities/region/server";

export default function sitemap(): MetadataRoute.Sitemap {
  const regions = regionRepo.findAll();

  const regionEntries: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `/${region.id}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "/",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...regionEntries,
  ];
}
