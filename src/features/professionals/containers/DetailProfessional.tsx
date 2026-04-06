import { UserDetailContent, UserDetailHeader } from "@/core/components/shared";
import { DetailProfessionalCard } from "../components/DetailProfessionalCard";
import { useDetailProfessional } from "../hooks/useDetailProfessional";
import { Box, Button, Typography, Divider } from "@mui/material";
import ProfileSkeleton from "@/core/components/shared/profile/ProfileSkeleton";
import { useEffect } from "react";

interface DetailProfessionalProps {
  professionalId: string;
  onDataLoaded?: (data: unknown) => void;
}

export function DetailProfessional({
  professionalId,
  onDataLoaded,
}: DetailProfessionalProps) {
  const { data, isLoading, error } = useDetailProfessional({
    professionalId,
  });

  useEffect(() => {
    if (data && onDataLoaded) {
      onDataLoaded(data);
    }
  }, [data, onDataLoaded]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <Box p={3} mx="auto">
        <Typography color="error" gutterBottom>
          Erro ao carregar detalhes do profissional.
        </Typography>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3} mx="auto">
        <Typography color="text.secondary" gutterBottom>
          Profissional não encontrado.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <UserDetailHeader
        active={data.active}
        name={data.fullName}
        entity={"Profissional de Saúde"}
        updatedAt={data.updatedAt}
      />

      <Divider sx={{ my: 3 }} />

      <UserDetailContent userData={data} />
      <DetailProfessionalCard data={data} />
    </>
  );
}
