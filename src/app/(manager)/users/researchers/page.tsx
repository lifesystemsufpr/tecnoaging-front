"use client";

import {
  ResearcherCrudPage,
  ResearcherCrudProvider,
} from "@/features/researchers";

export default function ResearcherRoute() {
  return (
    <ResearcherCrudProvider>
      <ResearcherCrudPage />
    </ResearcherCrudProvider>
  );
}
