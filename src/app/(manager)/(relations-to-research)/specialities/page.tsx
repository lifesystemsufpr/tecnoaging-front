"use client";

import TitleResourcePage from "@/components/common/TitleResourcePage";
import { makeTitleService } from "@/services/makeTitleService";
import { useMemo } from "react";

export default function SpecialityPage() {
  const service = useMemo(() => makeTitleService("speciality"), []);
  return <TitleResourcePage resourceName="Especialidade" service={service} />;
}
