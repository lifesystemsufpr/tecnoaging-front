import { useFetchEvaluation } from "@/features/evaluations/hooks/useFetchEvaluation";
import { useFetchEvaluationDetailed } from "@/features/evaluations/hooks/useFetchEvaluationDetailed";
import {
  Evaluation,
  MotionAnalysisResponse,
  STSMotionAnalysisResponse,
} from "@/features/evaluations/types/Evaluation.types";
import { createContext, useContext, useMemo } from "react";

interface ThirtySTSContextValue {
  id: string;
  repetitions?: number;
  evaluationData?: Evaluation;
  detailedData?: MotionAnalysisResponse;
  isEvaluationLoading?: boolean;
  isDetailedLoading?: boolean;
}

interface ThirtySTSContextProviderProps {
  children: React.ReactNode;
  id: string;
}

export const ThirtySTSContext = createContext<ThirtySTSContextValue>({
  id: "",
});

export function ThirtySTSProvider({
  children,
  id,
}: ThirtySTSContextProviderProps) {
  const { data: evaluationData, isLoading: isEvaluationLoading } =
    useFetchEvaluation({ id });
  const { data: detailedData, isLoading: isDetailedLoading } =
    useFetchEvaluationDetailed<STSMotionAnalysisResponse>({ id });

  const repetitions: number | undefined = useMemo(() => {
    return detailedData?.derived.indicators.find(
      (indicator) => indicator.name === "Repetitions"
    )?.value;
  }, [detailedData]);

  return (
    <ThirtySTSContext.Provider
      value={{
        id,
        repetitions,
        evaluationData,
        detailedData,
        isEvaluationLoading,
        isDetailedLoading,
      }}
    >
      {children}
    </ThirtySTSContext.Provider>
  );
}

export function useThirtySTSContext() {
  const context = useContext(ThirtySTSContext);
  if (!context) {
    throw new Error(
      "useThirtySTSContext must be used within a ThirtySTSProvider"
    );
  }
  return context;
}
