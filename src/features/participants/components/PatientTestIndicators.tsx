"use client";

import { useRouter } from "next/navigation";
import { Assessment, ChevronRight } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { TestSummary } from "../types/patient-dashboard.types";

interface PatientTestIndicatorsProps {
  tests: TestSummary[];
}

export function PatientTestIndicators({ tests }: PatientTestIndicatorsProps) {
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
          {tests.map((test, index) => (
            <Stack key={`${test.name}-${index}`} spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  {test.fullName || test.name}
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {test.count}
                </Typography>
              </Stack>

              {index < tests.length - 1 ? <Divider /> : null}
            </Stack>
          ))}
        </Stack>

        {false && (
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={() => router.push("/evaluations")}
          >
            Ver Relatório de Testes
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
