import { createContext, useContext } from "react";
import { Participant, HealthProfessional } from "@/core/types";
import useFetchQuestionnairesList from "../hooks/useFetchQuestionnairesList";

export interface QuestionnairesListContextValue extends ReturnType<
  typeof useFetchQuestionnairesList
> {
  selectedParticipant: Participant | null;
  setSelectedParticipant: (participant: Participant | null) => void;
  selectedProfessional: HealthProfessional | null;
  setSelectedProfessional: (professional: HealthProfessional | null) => void;
}

interface QuestionnairesListProviderProps {
  children: React.ReactNode;
  value: QuestionnairesListContextValue;
}

export const QuestionnairesListContext =
  createContext<QuestionnairesListContextValue | null>(null);

export function QuestionnairesListProvider({
  children,
  value,
}: QuestionnairesListProviderProps) {
  return (
    <QuestionnairesListContext.Provider value={value}>
      {children}
    </QuestionnairesListContext.Provider>
  );
}

export function useQuestionnairesListContext() {
  const context = useContext(QuestionnairesListContext);
  if (!context) {
    throw new Error(
      "useQuestionnairesListContext deve ser usado dentro de um QuestionnairesListProvider"
    );
  }
  return context;
}
