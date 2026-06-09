import { Box, Card, CardContent, Typography } from "@/core/components/ui";
import { ArrowUpRight, ArrowDownRight, Users, User } from "lucide-react";
import { TeamPerformance } from "../types";

interface PerformanceEvaluationsProps {
  data: TeamPerformance;
}

export default function PerformanceEvaluations({
  data,
}: PerformanceEvaluationsProps) {
  const isAboveAverage = data.individual >= data.teamAverage;
  const diff = data.individual - data.teamAverage;

  const progressValue = Math.min((data.individual / 10) * 100, 100);

  return (
    <Card
      variant="outlined"
      className="w-full border shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-transform border-gray-200"
    >
      <CardContent className="p-6">
        <Box className="mb-6 flex items-start justify-between">
          <Typography variant="body" className="font-bold text-foreground">
            Performance
          </Typography>

          <Box
            className={
              `inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ` +
              (isAboveAverage
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700")
            }
          >
            {isAboveAverage ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {isAboveAverage ? "Acima da média" : "Abaixo da média"}
          </Box>
        </Box>

        <Box className="space-y-6">
          <Box>
            <Box className="mb-1 flex items-center gap-1">
              <User size={18} className="text-muted-foreground" />
              <Typography
                variant="small"
                className="font-medium text-muted-foreground"
              >
                Seu Desempenho Individual
              </Typography>
            </Box>
            <Typography variant="h1" className="font-extrabold">
              {data.individual?.toFixed(0) || 0} Testes Aplicados
            </Typography>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${isAboveAverage ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </Box>

          <Box className="flex items-center justify-between rounded-xl bg-muted/40 p-4">
            <Box className="flex items-center gap-3">
              <Users size={20} className="text-primary" />
              <Box>
                <Typography
                  variant="caption"
                  className="block leading-none text-muted-foreground"
                >
                  MÉDIA DE TESTES APLICADOS PELA EQUIPE
                </Typography>
                <Typography variant="h4" className="font-bold">
                  {data.teamAverage?.toFixed(2) || 0}
                </Typography>
              </Box>
            </Box>

            <Box className="text-right">
              <Typography
                variant="caption"
                className="block text-muted-foreground"
              >
                DIFERENÇA
              </Typography>
              <Typography
                variant="body"
                className={`font-bold ${diff >= 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
