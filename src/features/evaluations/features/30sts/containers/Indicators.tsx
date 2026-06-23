import { Indicator } from "@/features/evaluations/types/Evaluation.types";
import { Box, Card, CardContent, Grid, Typography } from "@/core/components/ui";
import IndicatorsCard from "../components/IndicatorsCard";
interface IndicatorProps {
  indicators: Indicator[];
  overallClassification?: string;
}

export default function Indicators({
  indicators,
  overallClassification,
}: IndicatorProps) {
  const indicatorsLength = indicators.length;
  if (indicatorsLength === 0) return null;

  const overallClassificationExists = !!overallClassification;
  const span = Math.max(
    1,
    Math.floor(12 / indicatorsLength + (overallClassificationExists ? 1 : 0))
  );

  return (
    <Box mb={16}>
      <Grid container spacing={8}>
        {indicators.map((indicator, index) => (
          <Grid item xs={12} md={span} key={index}>
            <IndicatorsCard indicator={indicator} />
          </Grid>
        ))}
        {overallClassificationExists && (
          <Grid item xs={12} md={span}>
            <Card variant="outlined" className="border-gray-100 p-5">
              <CardContent className="p-0">
                <Typography variant="body" className="mb-1">
                  Classificação Global
                </Typography>
                <Typography variant="body" className="font-semibold">
                  {overallClassification}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
