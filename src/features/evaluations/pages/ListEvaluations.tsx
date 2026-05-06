"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Chip } from "@mui/material";
import {
  ColumnConfig,
  GenericTable,
} from "@/components/datatable/GenericTable";
import { PageSizeOption } from "@/types/enums/page-size-options";
import { formatDateTime, formatEvaluationName } from "@/core/utils/format";
import {
  ListEvaluationsProvider,
  useListEvaluationsContext,
} from "../contexts/ListEvaluationsContext";
import {
  useListEvaluationsQuery,
  useDeleteEvaluationMutation,
} from "../hooks/useListEvaluations";
import { ListEvaluationsFilters } from "../components/ListEvaluationsFilters";
import { EvaluationRaw, EvaluationType } from "../types/Evaluation.types";
import { routeDetailMap } from "../utils/format";

// ─── Table row type ───────────────────────────────────────────────────────────
type TableRow = EvaluationRaw & {
  patientName?: string;
  professionalName?: string;
  healthUnitName?: string;
};

// ─── Inner content (must be inside the provider) ──────────────────────────────
function ListEvaluationsContent() {
  const router = useRouter();
  const { page, setPage, pageSize, setPageSize } = useListEvaluationsContext();

  const { data: response, isLoading } = useListEvaluationsQuery();
  const deleteMutation = useDeleteEvaluationMutation();

  const rows = useMemo<TableRow[]>(() => {
    if (!response?.data) return [];
    return response.data.map((ev) => ({
      ...ev,
      patientName: ev.participant?.fullName,
      professionalName: ev.healthProfessional?.fullName,
      healthUnitName: ev.healthcareUnit?.name,
    }));
  }, [response?.data]);

  const totalRows = response?.meta?.total ?? 0;

  const columns = useMemo<ColumnConfig<TableRow>[]>(
    () => [
      {
        key: "type",
        header: "Tipo",
        width: 110,
        render: (params) => formatEvaluationName(params.value as string),
      },
      { key: "patientName", header: "Participante", flex: 1.2 },
      { key: "professionalName", header: "Profissional", flex: 1.2 },
      { key: "healthUnitName", header: "Unidade", width: 220, flex: 1.1 },
      {
        key: "time_init",
        header: "Início",
        render: (params) => formatDateTime(params.value as string),
      },
    ],
    []
  );

  return (
    <Box sx={{ p: 0 }}>
      <h1>Gerenciar Avaliações</h1>

      <Box mt={1} mb={1}>
        <ListEvaluationsFilters />
      </Box>

      <GenericTable<TableRow>
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id!}
        showActions
        onView={(row) =>
          router.push(routeDetailMap(row.type as EvaluationType, row.id!))
        }
        onDelete={async (row) => {
          await deleteMutation.mutateAsync(row.id!);
        }}
        loading={isLoading}
        density="compact"
        rowHref={(row) => routeDetailMap(row.type as EvaluationType, row.id!)}
        toolbar={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`Total: ${totalRows}`}
              size="small"
              variant="outlined"
            />
          </Box>
        }
        paginationModel={{
          pageSize,
          page,
        }}
        setPaginationModel={(model) => {
          setPageSize(model.pageSize as PageSizeOption);
          setPage(model.page);
        }}
        totalRows={totalRows}
        pageSize={pageSize}
        autoHeight
      />
    </Box>
  );
}

// ─── Exported page (wraps with provider) ──────────────────────────────────────
export function ListEvaluations({ type }: { type?: EvaluationType | "TMSTS" }) {
  return (
    <ListEvaluationsProvider type={type ?? "Todos"}>
      <ListEvaluationsContent />
    </ListEvaluationsProvider>
  );
}
