import {
  Evaluation,
  TMSTMotionAnalysisResponse,
} from "@/features/evaluations/types/Evaluation.types";
import { createContext, useContext, useMemo } from "react";
import { useFetchEvaluation } from "@/features/evaluations/hooks/useFetchEvaluation";
import { useFetchEvaluationDetailed } from "@/features/evaluations/hooks/useFetchEvaluationDetailed";

interface TwoMSTContextValue {
  id: string;
  steps?: number;
  evaluationData?: Evaluation;
  detailedData?: TMSTMotionAnalysisResponse;
  isEvaluationLoading?: boolean;
  isDetailedLoading?: boolean;
}

interface TwoMSTContextProviderProps {
  children: React.ReactNode;
  id: string;
}

export const TwoMSTContext = createContext<TwoMSTContextValue>({
  id: "",
});

export function TwoMSTProvider({ children, id }: TwoMSTContextProviderProps) {
  const { data: evaluationData, isLoading: isEvaluationLoading } =
    useFetchEvaluation({ id });
  const { data: detailedData, isLoading: isDetailedLoading } =
    useFetchEvaluationDetailed<TMSTMotionAnalysisResponse>({ id });

  const steps = useMemo(() => {
    console.log(detailedData)
    if (!detailedData?.derived.metrics) return undefined;

    return detailedData?.derived.metrics["nSteps"];
  }, [detailedData]);

  return (
    <TwoMSTContext.Provider
      value={{
        id,
        steps,
        evaluationData,
        detailedData,
        isEvaluationLoading,
        isDetailedLoading,
      }}
    >
      {children}
    </TwoMSTContext.Provider>
  );
}

export function useTwoMSTContext() {
  const context = useContext(TwoMSTContext);
  if (!context) {
    throw new Error("useTwoMSTContext must be used within a TwoMSTProvider");
  }
  return context;
}
