import { Box, Card, CardContent, Stack, useTheme } from "@mui/material";
import { useTwoMSTContext } from "../context/2MSTContext";
import ContinuityChart from "../components/ContinuityChart";
import BarScatterPlot from "../components/BarScatterPlot";
import GenericChart from "@/core/components/layout/GenericChart";
import { Gender } from "@/core/enums";

export default function DetailCharts() {
  const { detailedData, steps, evaluationData } = useTwoMSTContext();

  const theme = useTheme();
  const labelColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const participantGender = evaluationData?.participant.gender || Gender.FEMALE;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={4}>
          <Box sx={{ position: "relative" }}>
            <GenericChart
              data={detailedData!.processed.data}
              xKey="t"
              yKey="val"
              title={`Gráfico do ${detailedData!.processed.label}`}
              valueFormatter={(v) => `${v} ${detailedData!.processed.unit}`}
              timeSeries
              dense
              enableZoom
            />
          </Box>

          {!steps && (
            <p>
              Não informado no endpoint o total de passos | Passos padrão 78
            </p>
          )}

          <BarScatterPlot
            participantAge={detailedData!.derived.participantAgeOnEvaluation}
            participantSteps={steps ? steps : 78}
            participantGender={participantGender}
            labelColor={labelColor}
          />

          <ContinuityChart
            idadePaciente={detailedData!.derived.participantAgeOnEvaluation}
            passosPaciente={steps ? steps : 78}
            participantGender={participantGender}
            labelColor={labelColor}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
