"use client";

import {
  EducationalUnitCrudPage,
  EducationalUnitCrudProvider,
} from "@/features/institutions";

export default function EducationalUnitCrudRoute() {
  return (
    <EducationalUnitCrudProvider>
      <EducationalUnitCrudPage />
    </EducationalUnitCrudProvider>
  );
}
