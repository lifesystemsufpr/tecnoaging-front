import { Assessment, Timer } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

interface PatientTopInfoCardsProps {
  total: number;
  averageDuration: string;
  evaluationVariation: number;
}

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  variation: string;
  variationLabel: string;
  valueColor?: string;
}

function formatPercentVariation(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}%`;
}

function InfoCard({
  icon,
  label,
  value,
  variation,
  variationLabel,
  valueColor = "text.primary",
}: InfoCardProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          {icon}
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="end">
          <Typography variant="h5" fontWeight={700} color={valueColor}>
            {value}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" color="default" label={variation} />
            <Typography variant="caption" color="text.secondary">
              {variationLabel}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function PatientTopInfoCards({
  total,
  averageDuration,
  evaluationVariation,
}: PatientTopInfoCardsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6, xl: 6 }}>
        <InfoCard
          icon={<Assessment fontSize="small" color="primary" />}
          label="Avaliações Realizadas"
          value={total}
          variation={formatPercentVariation(evaluationVariation)}
          variationLabel="este mês"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6, xl: 6 }}>
        <InfoCard
          icon={<Timer fontSize="small" color="primary" />}
          label="Duração Média"
          value={averageDuration}
          variation="média"
          variationLabel="por teste"
        />
      </Grid>
    </Grid>
  );
}
