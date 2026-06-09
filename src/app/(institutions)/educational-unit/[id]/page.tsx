"use client";

import { EducationUnitDetailPage } from "@/features/institutions";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function EducationalUnitDetailRoute() {
  const { id } = useParams();
  const strId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  return <EducationUnitDetailPage id={strId} />;
}
