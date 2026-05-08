import IndicatorsCard from "@/features/evaluations/components/IndicatorsCard";
import { Indicator } from "@/features/evaluations/types/Evaluation.types";
import { Grid } from "@mui/material";

interface IndicatorProps {
  indicators: Indicator[];
}

export default function Indicators({ indicators }: IndicatorProps) {
  const indicatorsLength = indicators.length;
  if (indicatorsLength === 0) return null;

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {indicators.map((indicator, index) => (
        <Grid size={12 / indicatorsLength} key={index}>
          <IndicatorsCard indicator={indicator} />
        </Grid>
      ))}
    </Grid>
  );
}
