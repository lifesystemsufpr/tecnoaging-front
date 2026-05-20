"use client";

import { ArrowLeft } from "lucide-react";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Link,
  Separator,
  Typography,
} from "@/core/components/ui";
import { UserDetailContent } from "@/core/components/shared/profile/UserDetailContent";
import { UserDetailHeader } from "@/core/components/shared/profile/UserDetailHeader";
import { useDetailProfessional } from "../hooks/useDetailProfessional";
import { DetailProfessionalCard } from "../components/DetailProfessionalCard";
import { useRouter } from "next/navigation";
import ROUTES from "@/core/config/client.routes";

interface HealthProfessionalDetailPageProps {
  professionalId: string;
}

export function HealthProfessionalDetailPage({
  professionalId,
}: HealthProfessionalDetailPageProps) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useDetailProfessional({
    professionalId,
  });

  const handleBack = () => router.push(ROUTES.USERS.HEALTH_PROFESSIONALS.MAIN);
  const title = data?.fullName ?? "Detalhes";

  if (isLoading) {
    return (
      <Box p={24} mx="auto">
        <Typography>Carregando profissional...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={24} mx="auto">
        <Box display="flex" justify="space-between" align="center" mb={16}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              as="button"
              type="button"
              onClick={handleBack}
              underline="hover"
              color="inherit"
            >
              Profissionais de Saude
            </Link>
            <Typography className="text-foreground">Erro</Typography>
          </Breadcrumbs>
        </Box>

        <Card padding="md">
          <Typography className="text-destructive">
            Erro ao carregar profissional.
          </Typography>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </Card>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={24} mx="auto">
        <Box display="flex" justify="space-between" align="center" mb={16}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              as="button"
              type="button"
              onClick={handleBack}
              underline="hover"
              color="inherit"
            >
              Profissionais de Saude
            </Link>
            <Typography className="text-foreground">Detalhes</Typography>
          </Breadcrumbs>
        </Box>
        <Typography>Nenhum profissional encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Box p={24} mx="auto">
      <Box display="flex" justify="space-between" align="center" mb={16}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            as="button"
            type="button"
            onClick={handleBack}
            underline="hover"
            color="inherit"
          >
            Profissionais de Saude
          </Link>
          <Typography className="text-foreground">{title}</Typography>
        </Breadcrumbs>

        <Box display="flex" gap={8}>
          <Button
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={handleBack}
          >
            Voltar
          </Button>
        </Box>
      </Box>

      <Card variant="elevated" padding="md" className="border-0">
        <UserDetailHeader
          active={Boolean(data.active)}
          name={data.fullName ?? "—"}
          entity="Profissional de Saude"
          updatedAt={data.updatedAt}
        />

        <Separator className="my-6" />

        <UserDetailContent userData={data} />
        <DetailProfessionalCard data={data} />
      </Card>
    </Box>
  );
}
