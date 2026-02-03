import { useFetchListParticipant } from "@/features/participants/hooks/useFetchListParticipant";
import { createContext, useContext } from "react";

interface QuestionnairesListContextValue {
  // Defina aqui os tipos dos valores que o contexto irá fornecer
  // Por exemplo:
  // questionnaires: PatientQuestionnaireList;
}

interface QuestionnairesListProviderProps {
  children: React.ReactNode;
  value: QuestionnairesListContextValue;
}

export const QuestionnairesListContext = createContext(null);

export function QuestionnairesListProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: any;
}) {
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
