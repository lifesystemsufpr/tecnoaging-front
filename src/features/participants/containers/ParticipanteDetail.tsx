"use client";

import { useEffect } from "react";
import { useFetchParticipant } from "../hooks/useFetchParticipant";
import { DetailParticipantCard } from "../components/DetailParticipantCard";
import { UserDetailContent, UserDetailHeader } from "@/core/components/shared";
import ProfileSkeleton from "@/core/components/shared/profile/ProfileSkeleton";
import { Separator, Typography } from "@/core/components/ui";

interface ParticipantDetailProps {
  participantId: string;
  onDataLoaded?: (data: unknown) => void;
}

export function ParticipantDetail({
  participantId,
  onDataLoaded,
}: ParticipantDetailProps) {
  const {
    data,
    isLoading: loading,
    error: err,
  } = useFetchParticipant({
    participantId,
  });

  useEffect(() => {
    if (!loading && onDataLoaded) {
      onDataLoaded(data);
    }
  }, [loading, onDataLoaded]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (err) {
    return <Typography>Erro ao carregar detalhes do participante.</Typography>;
  }

  if (!data) {
    return <Typography>Participante não encontrado.</Typography>;
  }

  return (
    <>
      <UserDetailHeader
        active={data.active}
        name={data.fullName}
        entity={"Participante"}
        updatedAt={data.updatedAt}
      />

      <Separator className="my-6" />

      <UserDetailContent userData={data} />
      <DetailParticipantCard data={data} />
    </>
  );
}
