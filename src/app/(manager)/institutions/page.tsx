"use client";

import TitleResourcePage from "@/components/common/TitleResourcePage";
import { makeTitleService } from "@/services/makeTitleService";
import { useMemo } from "react";

export default function InstitutionsPage() {
  const service = useMemo(() => makeTitleService("institution"), []);
  return (
    <TitleResourcePage
      resourceName="Instituições de Ensino"
      service={service}
    />
  );
}
