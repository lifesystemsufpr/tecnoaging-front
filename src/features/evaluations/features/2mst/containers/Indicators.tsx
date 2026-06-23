import IndicatorsCard from "@/features/evaluations/components/IndicatorsCard";
import { Indicator } from "@/features/evaluations/types/Evaluation.types";
import { Box, Grid } from "@/core/components/ui";

interface IndicatorProps {
  metrics: Record<string, number | string>;
}

export default function Indicators({ metrics: indicators }: IndicatorProps) {
  const indicatorsLength = Object.keys(indicators).length;
  if (indicatorsLength === 0) return null;

  const span = Math.max(1, Math.floor(12 / (indicatorsLength / 5)));

  return (
    <Box mb={16}>
      <Grid container spacing={8}>
        {Object.keys(indicators).map((indicator, index) => (
          <Grid item xs={12} md={span} key={index}>
            <IndicatorsCard
              indicator={{ name: indicator, value: indicators[indicator] }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
