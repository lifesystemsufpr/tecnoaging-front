import { Indicator } from "@/features/evaluations/types/Evaluation.types";
import { Card, CardContent, Typography } from "@/core/components/ui";
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
    <Card variant="outlined" className="border-gray-100 p-5">
      <CardContent className="p-0">
        <Typography variant="body" className="mb-1">
          {translateIndicatorName(name)}
        </Typography>
        <Typography variant="body" className="font-semibold">
          {normalizedValue} {unit}
        </Typography>
      </CardContent>
    </Card>
  );
}
