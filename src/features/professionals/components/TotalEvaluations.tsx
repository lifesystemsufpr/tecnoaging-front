import { Box, Card, CardContent, Typography } from "@/core/components/ui";
import { Activity, Users, Mars, Venus } from "lucide-react";
import { CurrentMonthByGender } from "../types";

interface TotalEvaluationsProps {
  data: CurrentMonthByGender;
}

export default function TotalEvaluations({ data }: TotalEvaluationsProps) {
  return (
    <Card
      variant="outlined"
      className="w-full border shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md border-gray-200"
    >
      <CardContent className="p-6">
        <Box className="mb-6 flex items-center justify-between">
          <Typography
            variant="body"
            className="font-semibold text-muted-foreground"
          >
            Avaliações do Mês
          </Typography>
          <Box className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Activity size={18} />
          </Box>
        </Box>

        <Box className="space-y-6">
          <Box>
            <Typography variant="h1" className="font-extrabold tracking-tight">
              {data.total}
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 text-muted-foreground"
            >
              <Users size={16} /> total de pacientes atendidos
            </Typography>
          </Box>

          <Box className="flex gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <Box className="flex-1">
              <Box className="mb-1 flex items-center gap-1">
                <Mars size={18} className="text-blue-600" />
                <Typography
                  variant="caption"
                  className="font-bold uppercase tracking-wide text-muted-foreground"
                >
                  Homens
                </Typography>
              </Box>
              <Typography variant="h4" className="font-bold">
                {data.male}
              </Typography>
            </Box>

            <Box className="flex-1">
              <Box className="mb-1 flex items-center gap-1">
                <Venus size={18} className="text-rose-600" />
                <Typography
                  variant="caption"
                  className="font-bold uppercase tracking-wide text-muted-foreground"
                >
                  Mulheres
                </Typography>
              </Box>
              <Typography variant="h4" className="font-bold">
                {data.female}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
