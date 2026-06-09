"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { HealthUnitDetailPage } from "@/features/institutions";

export default function HealthUnitDetailRoute() {
  const { id } = useParams();
  const strId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  return <HealthUnitDetailPage id={strId} />;
}
