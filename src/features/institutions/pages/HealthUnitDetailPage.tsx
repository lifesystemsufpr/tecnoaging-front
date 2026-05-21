"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { HealthUnitDetail } from "../containers/HealthUnitDetail";
import { useFetchHealthUnit } from "../hooks/health-unit/useFetchHealthUnit";
import {
  Breadcrumbs,
  Link,
  Box,
  Typography,
  Button,
} from "@/core/components/ui";
import ROUTES from "@/core/config/client.routes";

interface HealthUnitDetailPageProps {
  id: string;
}

export function HealthUnitDetailPage({ id }: HealthUnitDetailPageProps) {
  const router = useRouter();
  const { data: healthUnit, isLoading } = useFetchHealthUnit({ id });

  const name = healthUnit?.name ?? "—";

  return (
    <Box p={24} mx="auto">
      <Box display="flex" justify="space-between" align="center" mb={16}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            as="button"
            type="button"
            onClick={() => router.push(ROUTES.INSTITUTIONS.HEALTH_UNITS.MAIN)}
            underline="hover"
            color="inherit"
          >
            Unidades de Saude
          </Link>
          <Typography className="text-foreground">
            {!isLoading && name !== "—" ? name : "Detalhes"}
          </Typography>
        </Breadcrumbs>

        <Box display="flex" gap={8}>
          <Button
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push(ROUTES.INSTITUTIONS.HEALTH_UNITS.MAIN)}
          >
            Voltar
          </Button>
        </Box>
      </Box>

      <HealthUnitDetail id={id} />
    </Box>
  );
}
