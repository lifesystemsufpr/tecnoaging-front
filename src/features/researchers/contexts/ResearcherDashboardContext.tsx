import { createContext, useContext, useMemo, useState } from "react";
import { GenderMode } from "../types";
import { Gender } from "@/core/enums";

interface ResearcherDashboardContextValue {
  genderMode: GenderMode;
  genderMapped: Gender;
  setGenderMode: (mode: GenderMode) => void;
}

interface ResearcherDashboardProviderProps extends React.PropsWithChildren {}

export const ResearcherDashboardContext =
  createContext<ResearcherDashboardContextValue>(
    {} as ResearcherDashboardContextValue
  );

export function ResearcherDashboardProvider({
  children,
}: ResearcherDashboardProviderProps) {
  const [genderMode, setGenderMode] = useState<GenderMode>("all");

  const genderMapped = useMemo(() => {
    switch (genderMode) {
      case "all":
        return Gender.MALE;
      case "male":
        return Gender.MALE;
      case "female":
        return Gender.FEMALE;
      default:
        return Gender.MALE;
    }
  }, [genderMode]);

  return (
    <ResearcherDashboardContext.Provider
      value={{ genderMode, genderMapped, setGenderMode }}
    >
      {children}
    </ResearcherDashboardContext.Provider>
  );
}

export function useResearcherDashboardContext() {
  const context = useContext(ResearcherDashboardContext);

  if (!context) {
    throw new Error(
      "useResearcherDashboardContext must be used within a ResearcherDashboardProvider"
    );
  }

  return context;
}
