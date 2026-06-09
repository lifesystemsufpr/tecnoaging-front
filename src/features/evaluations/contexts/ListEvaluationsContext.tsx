import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { PageSizeOption } from "@/core/enums/page-size-options";
import { EvaluationFilters } from "../types/Evaluation.types";
import { toISODateEnd, toISODateStart } from "@/core/utils";

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
// ─── Context value ────────────────────────────────────────────────────────────

export interface ListEvaluationsContextProps {
  children: React.ReactNode;
  type: string;
}

interface ListEvaluationsContextValue {
  // UI filters
  filters: ListEvaluationsFilters;
  setFilters: React.Dispatch<React.SetStateAction<ListEvaluationsFilters>>;

  // Applied filters
  appliedFilters: ListEvaluationsFilters;
  applyFilters: () => void;
  requestFilters: EvaluationFilters;

  // Pagination
  page: number;
  setPage: (page: number) => void;
  pageSize: PageSizeOption;
  setPageSize: (size: PageSizeOption) => void;

  // Helpers
  buildRequestFilters: (pagination?: {
    page?: number;
    pageSize?: number;
  }) => EvaluationFilters;
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
  const initialFilters = useMemo(
    () => ({
      ...DEFAULT_FILTERS,
      type,
    }),
    [type]
  );
  const [filters, setFilters] =
    useState<ListEvaluationsFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<ListEvaluationsFilters>(initialFilters);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);

  const requestFilters = useMemo<EvaluationFilters>(() => {
    const participantName =
      appliedFilters.patient?.name?.trim() ||
      appliedFilters.patientQuery.trim() ||
      undefined;
    const healthProfessionalName =
      appliedFilters.professional?.name?.trim() ||
      appliedFilters.professionalQuery.trim() ||
      undefined;

    return {
      participantName,
      healthProfessionalName,
      startDate: appliedFilters.dateFrom
        ? (toISODateStart(appliedFilters.dateFrom) ?? undefined)
        : undefined,
      endDate: appliedFilters.dateTo
        ? (toISODateEnd(appliedFilters.dateTo) ?? undefined)
        : undefined,
      type: appliedFilters.type === "Todos" ? undefined : appliedFilters.type,
    };
  }, [appliedFilters]);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setPage(0);
  }, [filters]);

  const buildRequestFilters = useCallback(
    (pagination?: { page?: number; pageSize?: number }): EvaluationFilters => ({
      ...requestFilters,
      page: pagination?.page ?? page + 1,
      pageSize: pagination?.pageSize ?? pageSize,
    }),
    [requestFilters, page, pageSize]
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(0);
  }, [initialFilters]);

  return (
    <ListEvaluationsContext.Provider
      value={{
        filters,
        setFilters,
        appliedFilters,
        applyFilters,
        requestFilters,
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
