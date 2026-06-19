import { Box, Card, CardContent, Typography } from "@/core/components/ui";
import { useThirtySTSContext } from "../context/30STSContext";
import ContinuityChart from "../components/ContinuityChart";
import BarScatterPlot from "../components/BarScatterPlot";
import GenericChart from "@/core/components/layout/GenericChart";
import { Gender } from "@/core/enums";
import EvaluationNoContent from "@/features/evaluations/components/EvaluationNoContent";
import { isSTSProcessedData } from "@/features/evaluations/types/Evaluation.types";
import Image from "next/image";

export default function DetailCharts() {
  const { detailedData, repetitions, evaluationData } = useThirtySTSContext();

  const processed = isSTSProcessedData(detailedData?.processed)
    ? detailedData.processed
    : null;

  const participantGender = evaluationData.participant.gender || Gender.FEMALE;

  if (
    processed?.data.length === 0 ||
    detailedData.derived.indicators.length === 0
  ) {
    return <EvaluationNoContent evaluationId={evaluationData.id} />;
  }

  return (
    <Card variant="outlined" className="border-gray-100">
      <CardContent>
        <Box display="flex" direction="column" gap={16}>
          <Box position="relative">
            <Image
              src="/chart-example.png"
              alt="Gráfico do Processado"
              width={80}
              height={80}
              style={{
                height: "auto",
                position: "absolute",
                top: 40,
                left: 0,
                zIndex: 1,
                borderRadius: 4,
                opacity: 0.8,
              }}
            />

            <GenericChart
              data={processed?.data}
              xKey="t"
              yKey="val"
              title={`Gráfico do ${processed?.label}`}
              valueFormatter={(v) => `${v} ${processed?.unit}`}
              timeSeries
              dense
              enableZoom
            />
          </Box>

          {repetitions == undefined ? (
            <Typography
              variant="body"
              color="secondary"
              className="text-center"
            >
              Não informado o total de repetições, contate a equipe responsável
              para reprocessar os dados com essa informação.
            </Typography>
          ) : (
            <>
              <BarScatterPlot
                participantAge={detailedData.derived.participantAgeOnEvaluation}
                participantRepetitions={repetitions}
                participantGender={participantGender}
                labelColor={"#000"}
              />

              <ContinuityChart
                idadePaciente={detailedData.derived.participantAgeOnEvaluation}
                repeticoesPaciente={repetitions}
                participantGender={participantGender}
                labelColor={"#000"}
              />
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
