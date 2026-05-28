"use client";

import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Grid,
  Table,
  Typography,
  createColumn,
  type FilterState,
  type TableColumnDef,
} from "@/core/components/ui";
import ROUTES from "@/core/config/client.routes";
import GenericChart from "@/core/components/layout/GenericChart";
import { ParticipantFilters } from "../components/ParticipantFilters";
import { EvaluationRaw, EvaluationType } from "../types/Evaluation.types";
import { useParticipantEvaluations } from "../hooks/useParticipantEvaluations";
import { useFetchHistoryRepetitions } from "../features/30sts/hooks/useFetchHistoryRepetitions";
import TestTypeCard from "../components/TestTypeCard";
import { TEST_TYPES } from "../consts/types";
import { formatDateTime, formatEvaluationName } from "@/core/utils/format";

export default function ParticipantEvaluations({
  participantId,
  withHeader = true,
}: {
  participantId: string;
  withHeader?: boolean;
}) {
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<string>("TTSTS");

  const columnsConfig = useMemo<TableColumnDef<EvaluationRaw>[]>(
    () => [
      createColumn({
        field: "type",
        header: "Tipo",
        render: (_, row) => formatEvaluationName(row.type as EvaluationType),
      }),
      createColumn({
        field: "profissional_nome",
        header: "Profissional",
        render: (_, row) => row.healthProfessional?.fullName ?? "—",
      }),
      createColumn({
        field: "unidade_nome",
        header: "Unidade",
        render: (_, row) => row.healthcareUnit?.name ?? "—",
      }),
      createColumn({
        field: "time_init",
        header: "Inicio",
        render: (_, row) => formatDateTime(row.time_init),
      }),
    ],
    []
  );

  const {
    patientData,
    evaluations,
    isLoading,
    totalRows,
    pagination,
    setPagination,
    handleSearch,
    handleTypeChange,
  } = useParticipantEvaluations(participantId);

  const { data: historyRepetitions } = useFetchHistoryRepetitions({
    patientId: participantId || "",
  });

  const handleOnViewEvaluation = (evaluation: EvaluationRaw) => {
    const routes: Record<string, string> = {
      FTSTS: ROUTES.EVALUATIONS.FTSTS_BY_ID(evaluation.id),
      TTSTS: ROUTES.EVALUATIONS.TTSTS_BY_ID(evaluation.id),
    };

    const path = routes[evaluation.type];
    if (path) router.push(path);
  };

  return (
    <Box p={8}>
      {withHeader && (
        <>
          <Box mb={8}>
            <Button
              onClick={() => router.back()}
              leftIcon={<ArrowLeft size={16} />}
              size="sm"
              variant="link"
            >
              Voltar
            </Button>
          </Box>

          <Typography as="h1" variant="body" className="mb-2">
            Avaliações do Paciente: {patientData?.fullName || "Carregando..."}
          </Typography>
        </>
      )}

      {/* Cards de tipos de teste */}
      <Box mb={12}>
        <Typography
          variant="small"
          className="mb-2 font-semibold opacity-70 tracking-[0.5px]"
        >
          TESTES DISPONÍVEIS
        </Typography>
        <Grid container spacing={8}>
          {TEST_TYPES.map((test) => (
            <Grid item xs={6} sm={3} key={test.id}>
              <TestTypeCard
                config={test}
                selected={selectedTest === test.id}
                onClick={() => {
                  setSelectedTest(test.id);
                  handleTypeChange(test.id);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {!historyRepetitions && <p>Erro ao carregar histórico de repetições</p>}

      {historyRepetitions &&
        historyRepetitions.length > 0 &&
        selectedTest === "TTSTS" && (
          <GenericChart
            data={historyRepetitions}
            xKey="day"
            yKey="repetitions"
            title={`Histórico de Repetições do Paciente`}
            valueFormatter={(v) => `${v} reps`}
            seriesType="line"
          />
        )}

      {((evaluations.length !== 0 && !isLoading) ||
        (historyRepetitions && historyRepetitions.length > 0)) && (
        <Box my={8}>
          <ParticipantFilters
            onSearch={({ dateFrom, dateTo }) => handleSearch(dateFrom, dateTo)}
          />
        </Box>
      )}

      <Box my={4}>
        {evaluations.length === 0 && !isLoading ? (
          <Typography variant="body">Nenhuma avaliação encontrada.</Typography>
        ) : (
          <Table.Root<EvaluationRaw>
            columns={columnsConfig}
            data={evaluations}
            serverSide={{
              total: totalRows,
              page: pagination.page + 1,
              pageSize: pagination.pageSize,
              filters: {} as FilterState,
              sort: {
                direction: undefined,
                field: undefined,
              },
              onPageChange: (newPage) =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(newPage - 1, 0),
                })),
              onPageSizeChange: (newSize) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: newSize,
                  page: 0,
                })),
              onFilterChange: () => undefined,
              onSortChange: () => undefined,
            }}
          >
            <Table.Header showActionsColumn />
            <Table.Body<EvaluationRaw>
              emptyMessage="Nenhuma avaliação encontrada"
              onRowClick={handleOnViewEvaluation}
              renderActions={(row) => (
                <Box display="flex" gap={4} justify="center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOnViewEvaluation(row);
                    }}
                    tooltip="Visualizar"
                  >
                    Ver
                  </Button>
                </Box>
              )}
            />
            <Table.Pagination />
          </Table.Root>
        )}
      </Box>
    </Box>
  );
}
