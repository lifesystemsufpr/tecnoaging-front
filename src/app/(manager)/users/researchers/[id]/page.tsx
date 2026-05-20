"use client";

import { ResearcherDetailPage } from "@/features/researchers";
import { useParams } from "next/navigation";

export default function ResearcherDetailRoute() {
  const params = useParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <ResearcherDetailPage researcherId={id} />;
}
