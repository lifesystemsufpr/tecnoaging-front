import { createContext, useCallback, useContext, useState } from "react";
import { PageSizeOption } from "@/types/enums/page-size-options";
import { toISODateStart, toISODateEnd } from "@/utils/dates";

// ─── Option type for autocomplete ─────────────────────────────────────────────
export type AutocompleteOption = { id: string; name: string };

// ─── Filters that the user can control (UI-facing) ────────────────────────────
export interface ListEvaluationsFilters {
  patient: AutocompleteOption | null;
  patientQuery: string;
  professional: AutocompleteOption | null;
  professionalQuery: string;
  dateFrom: string | null;
  dateTo: string | null;
  type: string;
}

// ─── Filters sent to the API (request-facing) ─────────────────────────────────
export interface EvaluationRequestFilters {
  patientName?: string;
  healthProfessionalName?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

// ─── Context value ────────────────────────────────────────────────────────────

export interface ListEvaluationsContextProps {
  children: React.ReactNode;
  type: string;
}

interface ListEvaluationsContextValue {
  // UI filters
  filters: ListEvaluationsFilters;
  setFilters: React.Dispatch<React.SetStateAction<ListEvaluationsFilters>>;

  // Pagination
  page: number;
  setPage: (page: number) => void;
  pageSize: PageSizeOption;
  setPageSize: (size: PageSizeOption) => void;

  // Helpers
  buildRequestFilters: () => EvaluationRequestFilters;
  resetFilters: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_FILTERS: ListEvaluationsFilters = {
  patient: null,
  patientQuery: "",
  professional: null,
  professionalQuery: "",
  dateFrom: null,
  dateTo: null,
  type: "Todos",
};

// ─── Context ──────────────────────────────────────────────────────────────────
const ListEvaluationsContext = createContext<ListEvaluationsContextValue>(
  {} as ListEvaluationsContextValue
);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ListEvaluationsProvider({
  children,
  type,
}: ListEvaluationsContextProps) {
  const [filters, setFilters] = useState<ListEvaluationsFilters>({
    ...DEFAULT_FILTERS,
    type,
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);

  const buildRequestFilters = useCallback((): EvaluationRequestFilters => {
    const patientName =
      filters.patient?.name?.trim() || filters.patientQuery.trim() || undefined;
    const healthProfessionalName =
      filters.professional?.name?.trim() ||
      filters.professionalQuery.trim() ||
      undefined;

    return {
      patientName,
      healthProfessionalName,
      startDate: filters.dateFrom
        ? (toISODateStart(filters.dateFrom) ?? undefined)
        : undefined,
      endDate: filters.dateTo
        ? (toISODateEnd(filters.dateTo) ?? undefined)
        : undefined,
      type: filters.type === "Todos" ? undefined : filters.type,
      page: page + 1,
      pageSize,
    };
  }, [filters, page, pageSize]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(0);
  }, []);

  return (
    <ListEvaluationsContext.Provider
      value={{
        filters,
        setFilters,
        page,
        setPage,
        pageSize,
        setPageSize,
        buildRequestFilters,
        resetFilters,
      }}
    >
      {children}
    </ListEvaluationsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useListEvaluationsContext() {
  const context = useContext(ListEvaluationsContext);

  if (!context) {
    throw new Error(
      "useListEvaluationsContext must be used within a ListEvaluationsProvider"
    );
  }

  return context;
}
