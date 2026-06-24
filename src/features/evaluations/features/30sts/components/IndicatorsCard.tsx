import { Card, CardContent, Typography } from "@/core/components/ui";
import { Indicator } from "@/features/evaluations/types/Evaluation.types";
import { translateIndicatorName } from "../utils/en-pt";

export default function IndicatorsCard({
  indicator,
}: {
  indicator: Indicator;
}) {
  const { name, value, unit } = indicator;

  if (!name) return null;

  const isRepetitionIndicator = name === "Repetitions";
  const normalizedValue = !isRepetitionIndicator
    ? value.toFixed(2).replace(".", ",")
    : value;

  return (
    <Card variant="outlined" className="border-gray-100 p-5">
      <CardContent className="p-0">
        <Typography variant="body" className="mb-2">
          {translateIndicatorName(name)}
        </Typography>
        <Typography variant="body" className="font-semibold">
          {normalizedValue} {unit}
        </Typography>
      </CardContent>
    </Card>
  );
}
