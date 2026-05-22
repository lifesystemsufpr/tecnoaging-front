import { ClipboardCheck, Users2 } from "lucide-react";
import { Summary } from "../../types";
import Card from "@/core/components/layout/Card";
import { Box, Grid } from "@/core/components/ui";

interface DashboardSummaryProps {
  data: Summary;
}

export default function DashboardSummary({ data }: DashboardSummaryProps) {
  const { totalEvaluations, totalPatients } = data;

  return (
    <Box display="flex" direction="row" gap={12}>
      <Grid container className="w-full" spacing={24}>
        <Grid item xs={12} sm={6} md={6}>
          <Card.Root className="relative">
            <Card.Icon className="justify-start">
              <Box className="p-2 rounded bg-blue-200">
                <Users2 size={30} color="#187efb" />
              </Box>
            </Card.Icon>
            <Card.Content
              title="Total de pacientes"
              content={totalPatients}
              className={""}
            />
            <Card.BackgroundIcon className="color-green-200">
              <Users2 size={68} color="#187efb" />
            </Card.BackgroundIcon>
          </Card.Root>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Card.Root className="relative">
            <Card.Icon className="justify-start">
              <Box className="p-2 rounded bg-green-100">
                <ClipboardCheck size={30} color="#1dfc55" />
              </Box>
            </Card.Icon>
            <Card.Content
              title="Avaliações Totais"
              content={totalEvaluations}
              className={""}
            />
            <Card.BackgroundIcon className="color-green-500">
              <ClipboardCheck size={68} color="#74fa96" />
            </Card.BackgroundIcon>
          </Card.Root>
        </Grid>
      </Grid>
    </Box>
  );
}
