"use client";

import { useRouter } from "next/navigation";
import { Assessment, ChevronRight, FitnessCenter } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

interface PatientTestIndicatorsProps {
  countTUG: number;
  count5TSTS: number;
}

export function PatientTestIndicators({
  countTUG,
  count5TSTS,
}: PatientTestIndicatorsProps) {
  const router = useRouter();

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={600}>
            Testes Mais Realizados
          </Typography>
          <Assessment color="action" />
        </Stack>

        <Stack spacing={2} my={3} flexGrow={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <FitnessCenter fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                TUG (Timed Up and Go)
              </Typography>
            </Stack>
            <Typography variant="body2" fontWeight={700}>
              {countTUG}
            </Typography>
          </Stack>

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              5TSTS
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {count5TSTS}
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant="outlined"
          endIcon={<ChevronRight />}
          onClick={() => router.push("/evaluations")}
        >
          Ver Relatório de Testes
        </Button>
      </CardContent>
    </Card>
  );
}
