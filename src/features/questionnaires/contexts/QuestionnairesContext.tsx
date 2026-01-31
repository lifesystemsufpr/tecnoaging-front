"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { PatientQuestionnaireList } from "../types/domain";
import { useFetchQuestionnaires } from "../hooks/useFetchQuestionnaires";

type QuestionnairesContextValue = ReturnType<typeof useFetchQuestionnaires>;

const QuestionnairesContext = createContext<QuestionnairesContextValue | null>(
  null
);

interface ProviderProps {
  children: ReactNode;
  patientId?: string;
  fetchAll?: () => Promise<PatientQuestionnaireList>;
}

export function QuestionnairesProvider({
  children,
  patientId,
  fetchAll,
}: ProviderProps) {
  const logic = useFetchQuestionnaires({ patientId, fetchAll });
  const value = useMemo(() => logic, [logic]);

  return (
    <QuestionnairesContext.Provider value={value}>
      {children}
    </QuestionnairesContext.Provider>
  );
}

export function useQuestionnaires() {
  const context = useContext(QuestionnairesContext);
  if (!context) {
    throw new Error(
      "useQuestionnaires deve ser usado dentro de um QuestionnairesProvider"
    );
  }
  return context;
}
