import { InfoItem } from "@/core/components/shared/InfoItem";
import { formatDateTime } from "@/core/utils/format";
import { Box, Card, CardContent, Grid, Typography } from "@/core/components/ui";
import { Evaluation } from "../types/Evaluation.types";
import { formatEvaluationName } from "../utils/format";
import { Gender } from "@/core/enums";

export default function EvaluationDetail({
  evaluationDetails,
}: {
  evaluationDetails: Evaluation;
}) {
  return (
    <Card variant="outlined" className="mb-4 border-gray-100 p-5">
      <CardContent className="p-0">
        <Typography variant="h4" className="mb-4" color="primary">
          Informações da Avaliação
        </Typography>

        <Box mb={16}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <InfoItem
                label="Nome"
                value={evaluationDetails.participant.fullName}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoItem
                label="Sexo"
                value={
                  evaluationDetails.participant.gender === Gender.MALE
                    ? "Masculino"
                    : "Feminino"
                }
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <InfoItem
                label="Peso"
                value={
                  evaluationDetails.participant.weight?.toString() + " kg" ||
                  "N/A"
                }
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <InfoItem
                label="Altura"
                value={
                  evaluationDetails.participant.height?.toString() + " cm" ||
                  "N/A"
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={8}>
          <Grid item xs={12} md={4}>
            <InfoItem
              label="Tipo"
              value={formatEvaluationName(evaluationDetails.type)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoItem
              label="Data"
              value={formatDateTime(evaluationDetails.time_end)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
