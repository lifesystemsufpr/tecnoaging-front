import { UserDetailHeader } from "@/core/components/shared";
import { useFetchHealthUnit } from "../hooks/health-unit/useFetchHealthUnit";
import { Box, Card, Grid, Separator, Typography } from "@/core/components/ui";
import { InfoField } from "@/core/components/shared/InfoField";
import { formatCEP } from "@/core/utils/format";

interface HealthUnitDetailProps {
  id: string;
}

export function HealthUnitDetail({ id }: HealthUnitDetailProps) {
  const { data: healthUnit, isLoading, error } = useFetchHealthUnit({ id });

  const name = healthUnit?.name ?? "—";
  const identifier = healthUnit?.id ?? id;
  const zip = healthUnit?.zipCode ? formatCEP(healthUnit.zipCode) : "—";
  const addressLine1 =
    [healthUnit?.street, healthUnit?.number]
      .filter((part) => Boolean(part))
      .join(", ") || "—";
  const complement = healthUnit?.complement || "—";
  const neighborhood = healthUnit?.neighborhood || "—";
  const cityState =
    [healthUnit?.city, healthUnit?.state]
      .filter((part) => Boolean(part))
      .join(" - ") || "—";
  const updatedAt = (healthUnit as { updatedAt?: string })?.updatedAt;
  const active = (healthUnit as { active?: boolean })?.active ?? true;

  if (isLoading) {
    return <Typography>Carregando Unidades...</Typography>;
  }

  if (error) {
    return <Typography>Erro ao carregar detalhes da unidade.</Typography>;
  }

  return (
    <Card variant="elevated" padding="md" className="border-0">
      <UserDetailHeader
        name={name}
        entity="Unidade de Saude"
        active={active}
        updatedAt={updatedAt}
      />

      <Separator className="my-6" />

      <Box display="flex" direction="column" gap={24}>
        <Grid container spacing={24}>
          <InfoField label="Nome da unidade" value={name} />
          <InfoField label="Identificador" value={identifier} copyable />
        </Grid>

        <Separator className="my-6" />

        <Grid container spacing={24}>
          <InfoField
            label="Endereco"
            value={addressLine1}
            subValue={`Complemento: ${complement}`}
          />
          <InfoField label="Bairro" value={neighborhood} />
          <InfoField label="Cidade / Estado" value={cityState} />
          <InfoField label="CEP" value={zip} copyable />
        </Grid>
      </Box>
    </Card>
  );
}
