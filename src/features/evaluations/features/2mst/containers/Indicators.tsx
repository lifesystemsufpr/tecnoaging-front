import IndicatorsCard from "@/features/evaluations/components/IndicatorsCard";
import { Indicator } from "@/features/evaluations/types/Evaluation.types";
import { Box, Grid } from "@/core/components/ui";

interface IndicatorProps {
  metrics: Record<string, number | string>;
}

export default function Indicators({ metrics: indicators }: IndicatorProps) {
  const validIndicators = Object.entries(indicators).filter(
    ([name, value]) =>
      name && value !== null && value !== undefined && value !== ""
  );

  if (validIndicators.length === 0) return null;

  return (
    <Box mb={16}>
      <Grid container spacing={8}>
        {validIndicators.map(([name, value]) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
            <IndicatorsCard indicator={{ name, value }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
