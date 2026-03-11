import { Box, Card, CardContent, Stack, useTheme } from "@mui/material";
import { useThirtySTSContext } from "../context/30STSContext";
import ContinuityChart from "../components/ContinuityChart";
import BarScatterPlot from "../components/BarScatterPlot";
import GenericChart from "@/core/components/layout/GenericChart";
import { Gender } from "@/core/enums";

export default function DetailCharts() {
  const { detailedData, repetitions , evaluationData} = useThirtySTSContext();

  const theme = useTheme();
  const labelColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const participantGender = evaluationData.participant.gender || Gender.FEMALE;

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

          <BarScatterPlot
            participantAge={detailedData.derived.participantAgeOnEvaluation}
            participantRepetitions={repetitions ? repetitions : 15}
            participantGender={participantGender}
            labelColor={labelColor}
          />

          <ContinuityChart
            idadePaciente={detailedData.derived.participantAgeOnEvaluation}
            repeticoesPaciente={repetitions ? repetitions : 15}
            labelColor={labelColor}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
