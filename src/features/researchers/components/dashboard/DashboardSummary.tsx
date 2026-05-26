import { Box, Grid } from "@mui/material";
import { ClipboardCheck, Users2 } from "lucide-react";
import { Summary } from "../../types";
import Card from "@/core/components/layout/Card";

interface DashboardSummaryProps {
  data: Summary;
}

export default function DashboardSummary({ data }: DashboardSummaryProps) {
  const { totalEvaluations, totalPatients } = data;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <Card.Root className="relative">
          <Card.Icon className="justify-start">
            <Box
              sx={{
                backgroundColor: "#bedafc",
                borderRadius: "15%",
                padding: "8px",
              }}
            >
              <Users2 size={30} color="#187efb" />
            </Box>
          </Card.Icon>
          <Card.Content
            title="Total de pacientes"
            content={totalPatients}
            className={""}
          />
          <Card.BackgroundIcon className="color-green-500">
            <Users2 size={68} color="#187efb" />
          </Card.BackgroundIcon>
        </Card.Root>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <Card.Root className="relative">
          <Card.Icon className="justify-start">
            <Box
              sx={{
                backgroundColor: "#c0fed0",
                borderRadius: "15%",
                padding: "8px",
              }}
            >
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
  );
}
