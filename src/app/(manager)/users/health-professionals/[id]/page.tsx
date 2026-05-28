"use client";

import { HealthProfessionalDetailPage } from "@/features/professionals";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const professionalId = Array.isArray(id) ? id[0] : id;

  if (!professionalId) {
    return null;
  }

  return <HealthProfessionalDetailPage professionalId={professionalId} />;
}
