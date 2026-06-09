"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { EducationUnitDetail } from "../containers/EducationUnitDetail";
import { useFetchEducationalUnit } from "../hooks/educational-unit/useFetchEducationalUnit";
import {
  Breadcrumbs,
  Link,
  Box,
  Typography,
  Button,
} from "@/core/components/ui";
import ROUTES from "@/core/config/client.routes";

interface EducationUnitDetailPageProps {
  id: string;
}

export function EducationUnitDetailPage({ id }: EducationUnitDetailPageProps) {
  const router = useRouter();
  const { data: educationUnit, isLoading } = useFetchEducationalUnit({ id });

  const name = educationUnit?.title ?? "—";

  return (
    <Box p={24} mx="auto">
      <Box display="flex" justify="space-between" align="center" mb={16}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            as="button"
            type="button"
            onClick={() =>
              router.push(ROUTES.INSTITUTIONS.EDUCATIONAL_UNITS.MAIN)
            }
            underline="hover"
            color="inherit"
          >
            Unidades de Ensino
          </Link>
          <Typography className="text-foreground">
            {!isLoading && name !== "—" ? name : "Detalhes"}
          </Typography>
        </Breadcrumbs>

        <Box display="flex" gap={8}>
          <Button
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() =>
              router.push(ROUTES.INSTITUTIONS.EDUCATIONAL_UNITS.MAIN)
            }
          >
            Voltar
          </Button>
        </Box>
      </Box>

      <EducationUnitDetail id={id} />
    </Box>
  );
}
