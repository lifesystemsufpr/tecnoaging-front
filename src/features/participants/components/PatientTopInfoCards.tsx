import { Timer, BookMarkedIcon } from "lucide-react";
import { Box, Card, CardContent, Grid, Typography } from "@/core/components/ui";
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
    <Card variant="outlined" className="h-full">
      <CardContent>
        <Box display="flex" align="center" gap={8} mb={8}>
          {icon}
          <Typography variant="small" className="text-muted">
            {label}
          </Typography>
        </Box>

        <Box display="flex" justify="space-between" align="flex-end">
          <Typography
            variant="h4"
            className="font-bold"
            style={{ color: valueColor }}
          >
            {value}
          </Typography>

          <Box display="flex" gap={8} align="center">
            <Box className="inline-flex items-center bg-slate-100 text-slate-800 text-sm px-2 py-0.5 rounded">
              {variation}
            </Box>
            <Typography variant="small" className="text-muted">
              {variationLabel}
            </Typography>
          </Box>
        </Box>
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
    <Grid container spacing={8}>
      <Grid item xs={12} md={6} xl={6}>
        <InfoCard
          icon={<BookMarkedIcon size={16} />}
          label="Avaliações Realizadas"
          value={total}
          variation={formatPercentVariation(evaluationVariation)}
          variationLabel="este mês"
        />
      </Grid>

      <Grid item xs={12} md={6} xl={6}>
        <InfoCard
          icon={<Timer size={16} />}
          label="Duração Média"
          value={averageDuration}
          variation="média"
          variationLabel="por teste"
        />
      </Grid>
    </Grid>
  );
}
