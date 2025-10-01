"use client";

import * as React from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  Alert,
  useTheme,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { Evaluation } from "@/types/domain/Evaluation";
import { evaluationsApi } from "@/types/api/Eveluation";
import { InfoItem } from "@/components/evaluations/InfoItem";
import EvaluationSkeleton from "@/components/evaluations/EvaluationSkeleton";

import SensorDataChart from "@/components/evaluations/charts/SensorDataChart";
import RadarChart from "@/components/evaluations/charts/RadarChart";
import FadigaAreaChart from "@/components/evaluations/charts/FadigaAreaChart";
import BarChart from "@/components/evaluations/charts/BarChart";
import ContinuityChart from "@/components/evaluations/charts/ContinuityChart";

import { calcularIdadeAnos } from "@/utils/format";
import {
  calcularIndicadores,
  classificarDesempenhoGeral,
} from "@/utils/analytics";
import { useSession } from "next-auth/react";
import { fetchEvaluationById } from "@/services/api-evaluation";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const theme = useTheme();
  const { data: session } = useSession();
  const labelColor = theme.palette.mode === "dark" ? "#fff" : "#000";

  const [evaluationDetails, setEvaluationDetails] =
    React.useState<Evaluation | null>(null);
  const [allEvaluations, setAllEvaluations] = React.useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const iconePorClassificacao: { [key: string]: React.ReactNode } = {
    Excelente: <CheckCircleIcon fontSize="small" color="success" />,
    Bom: <CheckIcon fontSize="small" color="info" />,
    Regular: <WarningAmberIcon fontSize="small" color="warning" />,
    Ruim: <CancelIcon fontSize="small" color="warning" />,
    Crítico: <ErrorOutlineIcon fontSize="small" color="error" />,
    "N/A": <HelpOutlineIcon fontSize="small" color="disabled" />,
  };

  const severidadePorClassificacao: {
    [key: string]: "success" | "info" | "warning" | "error";
  } = {
    Excelente: "success",
    Bom: "info",
    Regular: "warning",
    Ruim: "warning",
    Crítico: "error",
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [details, all] = await Promise.all([
          fetchEvaluationById(id, session?.accessToken),
          evaluationsApi.getAllEvaluations(),
        ]);
        console.log(details);
        setEvaluationDetails(details);
        setAllEvaluations(all);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const indicadoresRadar = React.useMemo(() => {
    if (!evaluationDetails || !evaluationDetails.sensorData.length) return null;
    return calcularIndicadores(evaluationDetails.sensorData, evaluationDetails);
  }, [evaluationDetails]);

  const classificacao = indicadoresRadar
    ? classificarDesempenhoGeral(indicadoresRadar)
    : "N/A";

  const potencias = React.useMemo(() => {
    if (!evaluationDetails) return [];
    const pot: number[] = [];
    const limiar = 1.0;
    const sensorData = evaluationDetails.sensorData;
    for (let i = 1; i < sensorData.length - 1; i++) {
      const prev = sensorData[i - 1].accel_z;
      const curr = sensorData[i].accel_z;
      const next = sensorData[i + 1].accel_z;
      if (curr > prev && curr > next && curr > limiar) {
        pot.push(curr);
      }
    }
    return pot;
  }, [evaluationDetails]);

  if (isLoading) return <EvaluationSkeleton />;
  if (!evaluationDetails)
    return <Container sx={{ py: 2 }}>Avaliação não encontrada.</Container>;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          component={NextLink}
          href="/5tsts"
          startIcon={<ArrowBackIcon />}
          size="small"
          variant="text"
        >
          Voltar para Avaliações
        </Button>
      </Box>

      {/* Informações da Avaliação */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Informações da Avaliação
          </Typography>
          <Grid container spacing={2}>
            <Grid size={12}>
              <InfoItem label="Tipo" value={evaluationDetails.type} />
            </Grid>
            <Grid size={12}>
              <InfoItem
                label="Data"
                value={new Date(evaluationDetails.date).toLocaleString("pt-BR")}
              />
            </Grid>
            <Grid size={12}>
              <InfoItem
                label="Tempo Total"
                value={evaluationDetails.totalTime}
              />
            </Grid>
            <Grid size={12}>
              <InfoItem
                label="Unidade de Saúde"
                value={evaluationDetails.healthcareUnit?.name}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Análise Funcional */}
      {indicadoresRadar && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Análise Funcional do Paciente
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {indicadoresRadar.map((item: any, idx: number) => (
                <Grid size={12} key={idx}>
                  <InfoItem label={item.name} value={item.classificacao} />
                </Grid>
              ))}
            </Grid>

            <Alert
              icon={iconePorClassificacao[classificacao]}
              severity={severidadePorClassificacao[classificacao] ?? "info"}
              variant="outlined"
            >
              <Typography
                variant="caption"
                sx={{ textTransform: "uppercase", fontWeight: 700 }}
              >
                Classificação Geral
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 800 }}>
                {classificacao}
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Gráficos */}
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={4}>
            <SensorDataChart
              sensorData={evaluationDetails.sensorData}
              labelColor={labelColor}
            />
            {indicadoresRadar && (
              <RadarChart
                indicators={indicadoresRadar}
                labelColor={labelColor}
              />
            )}
            {potencias.length > 0 && (
              <FadigaAreaChart potencias={potencias} labelColor={labelColor} />
            )}
            <ContinuityChart
              idadePaciente={calcularIdadeAnos(
                evaluationDetails.patient?.birthday,
                evaluationDetails.date
              )}
              tempoPaciente={parseInt(
                evaluationDetails.totalTime?.split(":")[2] || "0",
                10
              )}
              tipo={evaluationDetails.type as any}
              labelColor={labelColor}
            />
            {allEvaluations.length > 0 && (
              <BarChart
                evaluations={allEvaluations.filter(
                  (e) =>
                    e.patient.cpf === evaluationDetails.patient.cpf &&
                    e.type === "5TSTS"
                )}
                currentId={evaluationDetails.id}
                labelColor={labelColor}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
