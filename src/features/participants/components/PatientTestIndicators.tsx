"use client";

import { useRouter } from "next/navigation";
import { ClipboardList, ChevronRight } from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@/core/components/ui";
import { TestSummary } from "../types/patient-dashboard.types";

interface PatientTestIndicatorsProps {
  tests: TestSummary[];
}

export function PatientTestIndicators({ tests }: PatientTestIndicatorsProps) {
  const router = useRouter();

  return (
    <Card variant="outlined" className="h-full">
      <CardContent className="flex flex-col h-full">
        <Box display="flex" justify="space-between" align="center">
          <Typography variant="h4" className="font-semibold">
            Testes Mais Realizados
          </Typography>
          <ClipboardList />
        </Box>

        <Box className="my-3 flex-1">
          {tests.map((test, index) => (
            <Box key={`${test.name}-${index}`} className="mb-3">
              <Box className="flex justify-between items-center">
                <Typography variant="small" className="text-muted">
                  {test.fullName || test.name}
                </Typography>
                <Typography variant="small" className="font-bold">
                  {test.count}
                </Typography>
              </Box>

              {index < tests.length - 1 ? (
                <div className="border-t my-2" />
              ) : null}
            </Box>
          ))}
        </Box>

        {false && (
          <Button
            variant="outline"
            leftIcon={<ChevronRight />}
            onClick={() => router.push("/evaluations")}
          >
            Ver Relatório de Testes
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
