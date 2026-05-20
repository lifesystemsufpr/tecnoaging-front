"use client";

import {
  HealthUnitCrudPage,
  HealthUnitCrudProvider,
} from "@/features/institutions";

export default function HealthUnitCRUDPage() {
  return (
    <HealthUnitCrudProvider>
      <HealthUnitCrudPage />
    </HealthUnitCrudProvider>
  );
}
