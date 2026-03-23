import { Divider, Skeleton, Typography } from "@mui/material";
import { useFetchParticipant } from "../hooks/useFetchParticipant";
import { DetailParticipantCard } from "../components/DetailParticipantCard";
import { UserDetailContent, UserDetailHeader } from "@/core/components/shared";
import ProfileSkeleton from "@/core/components/shared/profile/ProfileSkeleton";

interface ParticipantDetailProps {
  participantId: string;
}

export function ParticipantDetail({ participantId }: ParticipantDetailProps) {
  const {
    participantData: data,
    isLoading: loading,
    error: err,
  } = useFetchParticipant({
    participantId,
  });

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

      <Divider sx={{ my: 3 }} />

      <UserDetailContent userData={data} />
      <DetailParticipantCard data={data} />
    </>
  );
}
