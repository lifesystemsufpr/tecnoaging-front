"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Table,
  createColumn,
  type FilterState,
  type TableColumnDef,
} from "@/core/components/ui";
import { formatDateTime, formatEvaluationName } from "@/core/utils/format";

import {
  useDeleteEvaluationMutation,
  useListEvaluations,
} from "../hooks/useListEvaluations";
import DeleteEvaluation from "../components/DeleteEvaluation";
import {
  Evaluation,
  EvaluationFilters,
  EvaluationType,
} from "../types/Evaluation.types";
import { routeDetailMap } from "../utils/format";
import { toast } from "sonner";

type TableRow = Evaluation & {
  patientName?: string;
  professionalName?: string;
  healthUnitName?: string;
};

interface EvaluationTableProps {
  filters?: EvaluationFilters;
}

export default function EvaluationTable({ filters }: EvaluationTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [evaluationPendingDeletion, setEvaluationPendingDeletion] =
    useState<TableRow | null>(null);
  const deleteMutation = useDeleteEvaluationMutation();

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading } = useListEvaluations({
    pageSize: pageSize,
    page: page,
    filters: filters,
  });

  const rows = useMemo<TableRow[]>(() => {
    if (!data?.data) return [];
    return data.data.map((ev) => ({
      ...ev,
      patientName: ev.participant?.fullName,
      professionalName: ev.healthProfessional?.fullName,
      healthUnitName: ev.healthcareUnit?.name,
    }));
  }, [data?.data]);

  const columnsConfig = useMemo<TableColumnDef<TableRow>[]>(
    () => [
      createColumn({
        field: "type",
        header: "Tipo",
        render: (_, row) => formatEvaluationName(row.type as EvaluationType),
        sortable: true,
      }),
      createColumn({
        field: "patientName",
        header: "Participante",
        render: (_, row) => row.patientName ?? "—",
        sortable: true,
      }),
      createColumn({
        field: "professionalName",
        header: "Profissional",
        render: (_, row) => row.professionalName ?? "—",
        sortable: true,
      }),
      createColumn({
        field: "healthUnitName",
        header: "Unidade",
        render: (_, row) => row.healthUnitName ?? "—",
        sortable: true,
      }),
      createColumn({
        field: "time_init",
        header: "Início",
        render: (_, row) => formatDateTime(row.time_init),
        sortable: true,
      }),
    ],
    []
  );

  if (isLoading) {
    return <div>Carregando avaliações...</div>;
  }

  const totalRows = data?.meta?.total ?? 0;
  const currentPage = page;
  const serverSideFilters: FilterState = {};

  return (
    <Box>
      <DeleteEvaluation
        open={!!evaluationPendingDeletion}
        evaluation={evaluationPendingDeletion}
        onClose={() => setEvaluationPendingDeletion(null)}
        onConfirm={() => {
          if (!evaluationPendingDeletion?.id) return;
          deleteMutation.mutate(evaluationPendingDeletion.id, {
            onSuccess: () => {
              setEvaluationPendingDeletion(null);
              toast.success("Avaliação excluída com sucesso.");
            },
            onError: () => {
              toast.error("Erro ao excluir avaliação. Tente novamente.");
            },
          });
        }}
      />
      <Table.Root<TableRow>
        columns={columnsConfig}
        data={rows}
        serverSide={{
          total: totalRows,
          page: currentPage,
          pageSize: pageSize,
          filters: serverSideFilters,
          sort: {
            direction: undefined,
            field: undefined,
          },
          onPageChange: (newPage) => setPage(Math.max(newPage, 1)),
          onPageSizeChange: (newSize) => {
            setPageSize(newSize);
            setPage(1);
          },
          onFilterChange: () => undefined,
          onSortChange: () => undefined,
        }}
      >
        <Table.Header showActionsColumn />
        <Table.Body<TableRow>
          emptyMessage="Nenhuma avaliação encontrada"
          onRowClick={(row) =>
            router.push(routeDetailMap(row.type as EvaluationType, row.id!))
          }
          renderActions={(row) => (
            <Box display="flex" gap={4} justify="center">
              <Button
                variant="destructive"
                size="sm"
                tooltip="Excluir"
                onClick={(event) => {
                  event.stopPropagation();
                  if (!row.id) return;
                  setEvaluationPendingDeletion(row);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Box>
          )}
        />
        <Table.Pagination />
      </Table.Root>
    </Box>
  );
}
