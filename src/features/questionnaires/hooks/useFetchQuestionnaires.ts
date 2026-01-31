import { useState, useCallback, useEffect } from "react";
import { fetchPatientQuestionnaires } from "@/services/api-questionnaires";
import {
  PatientQuestionnaire,
  PatientQuestionnaireList,
} from "../types/domain";

interface UseFetchQuestionnairesProps {
  patientId?: string;
  fetchAll?: () => Promise<PatientQuestionnaireList>;
}

export function useFetchQuestionnaires({
  patientId,
  fetchAll,
}: UseFetchQuestionnairesProps) {
  const [questionnaires, setQuestionnaires] =
    useState<PatientQuestionnaireList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<PatientQuestionnaire | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = fetchAll
        ? await fetchAll()
        : patientId
          ? await fetchPatientQuestionnaires(patientId)
          : [];
      setQuestionnaires(data);
    } catch (err) {
      setError("Não foi possível carregar os questionários.");
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [fetchAll, patientId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openQuestionnaire = useCallback(
    (q: PatientQuestionnaire) => setSelectedQuestionnaire(q),
    []
  );
  const closeQuestionnaire = useCallback(
    () => setSelectedQuestionnaire(null),
    []
  );

  return {
    questionnaires,
    loading,
    error,
    hasLoaded,
    isEmpty: hasLoaded && questionnaires.length === 0,
    selectedQuestionnaire,
    openQuestionnaire,
    closeQuestionnaire,
    refresh,
  };
}
