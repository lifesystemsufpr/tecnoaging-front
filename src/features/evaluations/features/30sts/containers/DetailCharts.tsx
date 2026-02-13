import SensorDataChart from "@/components/evaluations/charts/SensorDataChart";
import { Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { useThirtySTSContext } from "../context/30STSContext";
import ContinuityChart from "../components/ContinuityChart";
import GenericChart from "@/core/components/layout/GenericChart";
import { mockRepetitionData } from "../mocks";

export default function DetailCharts() {
  const { detailedData, repetitions } = useThirtySTSContext();
  const theme = useTheme();
  const labelColor = theme.palette.mode === "dark" ? "#fff" : "#000";

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={4}>
          {!repetitions && (
            <p>
              Nao informado no endpoint o total de repeticoes | Repeticoes
              padrao 15
            </p>
          )}

          <ContinuityChart
            idadePaciente={detailedData.derived.participantAgeOnEvaluation}
            repeticoesPaciente={repetitions ? repetitions : 15}
            labelColor={labelColor}
          />

          <GenericChart
            data={mockRepetitionData}
            xKey="day"
            yKey="repetitions"
            title={`Comparação de Repetições por Dia ${mockRepetitionData ? "de Dados Falsos" : ""}`}
            valueFormatter={(v) => `${v} reps`}
            seriesType="line"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
