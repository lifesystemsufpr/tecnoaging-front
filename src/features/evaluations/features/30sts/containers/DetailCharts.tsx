import { Box, Card, CardContent, Stack, useTheme } from "@mui/material";
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
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src="/chart-example.png"
              alt="Gráfico do Processado"
              sx={{
                width: 80,
                height: "auto",
                position: "absolute",
                top: 40,
                left: 0,
                zIndex: 1,
                borderRadius: "4px",
                opacity: 0.8,
              }}
            />

            <GenericChart
              data={detailedData.processed.data}
              xKey="t"
              yKey="val"
              title={`Gráfico do ${detailedData.processed.label}`}
              valueFormatter={(v) => `${v} ${detailedData.processed.unit}`}
              timeSeries
              dense
              enableZoom
            />
          </Box>

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
            showLabels
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
