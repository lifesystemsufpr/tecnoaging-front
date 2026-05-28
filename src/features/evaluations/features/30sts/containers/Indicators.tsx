import IndicatorsCard from "@/features/evaluations/components/IndicatorsCard";
import { Indicator } from "@/features/evaluations/types/Evaluation.types";
import { Box, Grid } from "@/core/components/ui";
interface IndicatorProps {
  indicators: Indicator[];
}

export default function Indicators({ indicators }: IndicatorProps) {
  const indicatorsLength = indicators.length;
  if (indicatorsLength === 0) return null;

  const span = Math.max(1, Math.floor(12 / indicatorsLength));

  return (
    <Box mb={16}>
      <Grid container spacing={8}>
        {indicators.map((indicator, index) => (
          <Grid item xs={12} md={span} key={index}>
            <IndicatorsCard indicator={indicator} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
