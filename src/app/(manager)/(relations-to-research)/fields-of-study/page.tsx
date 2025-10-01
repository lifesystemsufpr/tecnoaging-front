"use client";

import TitleResourcePage from "@/components/common/TitleResourcePage";
import { makeTitleService } from "@/services/makeTitleService";
import { useMemo } from "react";

export default function FieldOfStudyPage() {
  const service = useMemo(() => makeTitleService("field-of-study"), []);
  return <TitleResourcePage resourceName="Área de Estudo" service={service} />;
}
