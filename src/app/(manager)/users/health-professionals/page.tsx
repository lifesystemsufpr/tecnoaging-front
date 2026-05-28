"use client";
import {
  HealthProfessionalsCrudPage,
  ProfessionalCrudProvider,
} from "@/features/professionals";

export default function HealthProRoute() {
  return (
    <ProfessionalCrudProvider>
      <HealthProfessionalsCrudPage />
    </ProfessionalCrudProvider>
  );
}
