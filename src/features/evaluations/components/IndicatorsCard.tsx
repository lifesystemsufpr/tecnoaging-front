import { Indicator } from "@/features/evaluations/types/Evaluation.types";
import { Card, CardContent, Typography } from "@mui/material";
import { translateIndicatorName } from "../features/30sts/utils/en-pt";

export default function IndicatorsCard({
  indicator,
}: {
  indicator: Indicator;
}) {
  const { name, value, unit } = indicator;
  const normalizedValue =
    name === "Repetitions" ? Math.round(value) : value.toFixed(2);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {translateIndicatorName(name)}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {normalizedValue} {unit}
        </Typography>
      </CardContent>
    </Card>
  );
}
