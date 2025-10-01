"use client";
import { useSession } from "next-auth/react";
import HomePacientContent from "@/components/pages/homePacient/HomePacientContent";
import HomeResearchContent from "@/components/pages/homeResearch/HomeResearchContent";
import HomeHealth from "@/components/pages/homeHealth/HomeContent";
import { SystemRoles } from "@/types/enums/system-roles";

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
    <HomePacientContent />
  ) : tipo === SystemRoles.RESEARCHER ? (
    <HomeResearchContent />
  ) : (
    <HomeHealth />
  );
}
