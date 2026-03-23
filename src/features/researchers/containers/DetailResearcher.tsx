import { Box, Button, Divider, Skeleton, Typography } from "@mui/material";
import { DetailResearcherCard } from "../components/DetailResearcherCard";
import { useDetailResearcher } from "../hooks/useDetailResearcher";
import { UserDetailContent } from "@/core/components/shared/profile/UserDetailContent";
import { UserDetailHeader } from "@/core/components/shared/profile/UserDetailHeader";
import ProfileSkeleton from "@/core/components/shared/profile/ProfileSkeleton";

interface DetailResearcherProps {
  researcherId: string;
}

export function DetailResearcher({ researcherId }: DetailResearcherProps) {
  const { data, isLoading, error } = useDetailResearcher({ researcherId });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <Box p={3} mx="auto">
        <Typography color="error" gutterBottom>
          Erro ao carregar detalhes do pesquisador.
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
          Pesquisador nao encontrado.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <UserDetailHeader
        active={data.active}
        name={data.fullName}
        entity={"Pesquisador"}
        updatedAt={data.updatedAt}
      />

      <Divider sx={{ my: 3 }} />

      <UserDetailContent userData={data} />
      <DetailResearcherCard data={data} />
    </>
  );
}
