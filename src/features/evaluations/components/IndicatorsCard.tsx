import { Card, CardContent, Typography } from "@/core/components/ui";
import {
  translateIndicatorName,
  translateIndicatorValue,
} from "../features/30sts/utils/en-pt";

export default function IndicatorsCard({
  indicator,
}: {
  indicator: { name: string, value: string | number };
}) {
  const { name, value } = indicator;
  if (!name || !value) return null;

  return (
    <Card variant="outlined" className="border-gray-100 p-5">
      <CardContent className="p-0">
        <Typography variant="body" className="mb-1">
          {translateIndicatorName(name)}
        </Typography>
        <Typography variant="body" className="font-semibold">
          {/*{normalizedValue} {unit}*/}
          {translateIndicatorValue(value)}
        </Typography>
      </CardContent>
    </Card>
  );
}
