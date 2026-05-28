import { UserDetailHeader } from "@/core/components/shared";
import { Box, Card, Grid, Separator, Typography } from "@/core/components/ui";
import { InfoField } from "@/core/components/shared/InfoField";
import { useFetchEducationalUnit } from "../hooks/educational-unit/useFetchEducationalUnit";

interface EducationUnitDetailProps {
  id: string;
}

export function EducationUnitDetail({ id }: EducationUnitDetailProps) {
  const {
    data: educationUnit,
    isLoading,
    error,
  } = useFetchEducationalUnit({
    id,
  });

  const name = educationUnit?.title ?? "—";
  const identifier = educationUnit?.id ?? id;
  const updatedAt = educationUnit?.updatedAt;

  if (isLoading) {
    return <Typography>Carregando unidades de ensino...</Typography>;
  }

  if (error) {
    return <Typography>Erro ao carregar detalhes da unidade.</Typography>;
  }

  return (
    <Card variant="elevated" padding="md" className="border-0">
      <UserDetailHeader
        name={name}
        entity="Unidade de Ensino"
        active={true}
        updatedAt={updatedAt}
      />

      <Separator className="my-6" />

      <Box display="flex" direction="column" gap={24}>
        <Grid container spacing={24}>
          <InfoField label="Nome do Ensino" value={name} />
          <InfoField label="Identificador" value={identifier} copyable />
        </Grid>
      </Box>
    </Card>
  );
}
