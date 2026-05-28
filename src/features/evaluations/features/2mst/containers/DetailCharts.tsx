import { Box, Card, CardContent } from "@/core/components/ui";
import { useTwoMSTContext } from "../context/2MSTContext";
import ContinuityChart from "../components/ContinuityChart";
import BarScatterPlot from "../components/BarScatterPlot";
import GenericChart from "@/core/components/layout/GenericChart";
import { Gender } from "@/core/enums";
import { isTMSTProcessedData } from "@/features/evaluations/types/Evaluation.types";

export default function DetailCharts() {
  const { detailedData, steps, evaluationData } = useTwoMSTContext();

  const processed = isTMSTProcessedData(detailedData?.processed)
    ? detailedData.processed
    : null;

  const participantGender = evaluationData?.participant.gender || Gender.FEMALE;

  return (
    <Card variant="outlined" className="mb-4 border-gray-100 p-5">
      <CardContent className="p-0">
        <Box display="flex" direction="column" gap={16}>
          <Box position="relative">
            <GenericChart
              data={processed?.data.timeseries}
              xKey="t"
              yKey="val"
              title={`Gráfico do ${processed?.unit || "Valor"}`}
              valueFormatter={(v) => `${v} ${processed?.unit}`}
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
            labelColor={"#000"}
          />

          <ContinuityChart
            idadePaciente={detailedData!.derived.participantAgeOnEvaluation}
            passosPaciente={steps ? steps : 78}
            participantGender={participantGender}
            labelColor={"#000"}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
