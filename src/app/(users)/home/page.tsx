"use client";
import { useSession } from "next-auth/react";

import PatientDashboardPage from "@/features/participants/pages/PatientDashboardPage";
import ProfessionalDashboardPage from "@/features/professionals/pages/DashboardPage";
import ResearcherDashboard from "@/features/researchers/pages/ResearcherDashboard";
import { SystemRoles } from "@/core/enums";

export default function HomeDashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">Carregando...</div>
    );
  }

  if (!session) {
    return <div className="p-6 text-red-500">Usuário não autenticado</div>;
  }

  const tipo = session?.user?.role || "researcher";

  return tipo === SystemRoles.PATIENT ? (
    <PatientDashboardPage />
  ) : tipo === SystemRoles.RESEARCHER ? (
    <ResearcherDashboard />
  ) : (
    <ProfessionalDashboardPage />
  );
}
