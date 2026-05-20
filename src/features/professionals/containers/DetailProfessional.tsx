"use client";

import { useEffect } from "react";
import { DetailProfessionalCard } from "../components/DetailProfessionalCard";
import { useDetailProfessional } from "../hooks/useDetailProfessional";
import ProfileSkeleton from "@/core/components/shared/profile/ProfileSkeleton";
import { UserDetailContent, UserDetailHeader } from "@/core/components/shared";
import { Box, Button, Separator, Typography } from "@/core/components/ui";

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
    if (!isLoading && onDataLoaded) {
      onDataLoaded(data);
    }
  }, [isLoading, onDataLoaded]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <Box p={3} mx="auto">
        <Typography color="error">
          Erro ao carregar detalhes do profissional.
        </Typography>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3} mx="auto">
        <Typography color="secondary">Profissional não encontrado.</Typography>
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

      <Separator className="my-6" />

      <UserDetailContent userData={data} />
      <DetailProfessionalCard data={data} />
    </>
  );
}
