"use client";

import NextLink from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  ColumnConfig,
  GenericTable,
} from "@/components/datatable/GenericTable";
import { fetchEvaluations } from "@/services/api-evaluation";
import { fetchPatientById } from "@/services/api-patient";
import { EvaluationRaw } from "@/types/domain/Evaluation";
import { Patient } from "@/types/domain/Patient";
import { PageSizeOption } from "@/types/enums/page-size-options";
import { formatDateTime } from "@/utils/dates";
import { Box, Button, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const columns: ColumnConfig<EvaluationRaw>[] = [
  { key: "type", header: "Tipo", width: 110 },
  {
    key: "profissional_nome" as any,
    header: "Profissional",
    flex: 1.2,
    valueGetter: (row) => row.healthProfessional?.fullName ?? "",
  },
  {
    key: "unidade_nome" as any,
    header: "Unidade",
    width: 220,
    flex: 1.1,
    valueGetter: (row) => row.healthcareUnit?.name ?? "",
  },
  {
    key: "time_init",
    header: "Inicio",
    render: (params) => formatDateTime(params.value as string),
  },
];

export default function PatientsEvaluationsPage() {
  const params = useParams();
  const patientId = params.id;
  const router = useRouter();

  const [initDate, setInitDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [patientData, setPatientData] = useState<Patient>(null);
  const [evaluations, setEvaluations] = useState<EvaluationRaw[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState(0);

  const [paginationModel, setPaginationModel] = useState<{
    pageSize: PageSizeOption;
    page: number;
  }>({
    pageSize: 20,
    page: 0,
  });

  //Atualmente terei que implementar um api composition para buscar os dados do paciente e depois as avaliações
  //(necessario endpoint de avaliações com filtro por ID do paciente)
  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const resp = await fetchPatientById({
        id: patientId as string,
      });
      setPatientData(resp);
      const patientEvaluations = await fetchEvaluations({
        filters: {
          startDate: initDate || undefined,
          endDate: endDate || undefined,
          patientCpf: resp.cpf,
          page: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
        },
      });
      setEvaluations(patientEvaluations.data);
      setTotalRows(patientEvaluations.meta.total || 0);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar avaliações do paciente:", error);
      toast.error("Erro ao carregar avaliações do paciente");
      setIsLoading(false);
    }
  };

  const handleOnViewEvaluation = (evaluation: EvaluationRaw) => {
    const evaluationType = evaluation.type;
    switch (evaluationType) {
      case "FTSTS":
        router.push(`/5tsts/${evaluation.id}`);
        break;
      case "30STS":
        router.push(`/30sts/${evaluation.id}`);
      default:
        break;
    }
  };

  useEffect(() => {
    loadPatients();
  }, [patientId, initDate, endDate, paginationModel]);

  return (
    <Box padding={2}>
      <Box sx={{ mb: 2 }}>
        <Button
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon />}
          size="small"
          variant="text"
        >
          Voltar
        </Button>
      </Box>
      <h1>Avaliações do Paciente: {patientData?.fullName}</h1>
      <Box marginTop={1} marginBottom={1}>
        {evaluations.length === 0 && !isLoading ? (
          <Typography>Nenhuma avaliação encontrada.</Typography>
        ) : (
          <GenericTable
            columns={columns}
            rows={evaluations}
            loading={isLoading}
            showActions={true}
            onView={handleOnViewEvaluation}
            pageSize={paginationModel.pageSize}
            setPaginationModel={setPaginationModel}
            autoHeight
            totalRows={totalRows}
          />
        )}
      </Box>
    </Box>
  );
}
