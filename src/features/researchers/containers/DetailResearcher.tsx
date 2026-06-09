import { DetailResearcherCard } from "../components/DetailResearcherCard";
import { useDetailResearcher } from "../hooks/useDetailResearcher";
import { UserDetailContent } from "@/core/components/shared/profile/UserDetailContent";
import { UserDetailHeader } from "@/core/components/shared/profile/UserDetailHeader";
import ProfileSkeleton from "@/core/components/shared/profile/ProfileSkeleton";
import { useEffect } from "react";
import { Box, Button, Separator, Typography } from "@/core/components/ui";

interface DetailResearcherProps {
  researcherId: string;
  onDataLoaded?: (data: unknown) => void;
}

export function DetailResearcher({
  researcherId,
  onDataLoaded,
}: DetailResearcherProps) {
  const { data, isLoading, error } = useDetailResearcher({ researcherId });

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
        <Typography color="accent">
          Erro ao carregar detalhes do pesquisador.
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
        <Typography color="secondary">Pesquisador nao encontrado.</Typography>
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

      <Separator className="my-6" />

      <UserDetailContent userData={data} />
      <DetailResearcherCard data={data} />
    </>
  );
}
