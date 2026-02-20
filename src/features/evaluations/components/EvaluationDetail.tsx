import { InfoItem } from "@/components/evaluations/InfoItem";
import { formatDateTime } from "@/core/utils/format";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Evaluation } from "../types/Evaluation.types";
import { formatEvaluationName } from "../utils/format";

export default function EvaluationDetail({
  evaluationDetails,
}: {
  evaluationDetails: Evaluation;
}) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Informações da Avaliação
        </Typography>

        <Grid container spacing={2}>
          <Grid size={4}>
            <InfoItem
              label="Tipo"
              value={formatEvaluationName(evaluationDetails.type)}
            />
          </Grid>
          <Grid size={4}>
            <InfoItem
              label="Data"
              value={formatDateTime(evaluationDetails.time_end)}
            />
          </Grid>
          <Grid size={4}>
            <InfoItem
              label="Unidade de Saúde"
              value={evaluationDetails.healthcareUnit?.name}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
