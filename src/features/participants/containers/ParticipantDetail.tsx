"use client";

import { Box, Divider, Paper, Typography, Button, Grid } from "@mui/material";

import DatailLoading from "../components/DatailLoading";
import { useFetchParticipant } from "../hooks/useFetchParticipant";

import { fmtNumber, formatData } from "@/core/utils/format";
import { UserDetailContent } from "@/core/components/shared/UserDetailContent";
import { UserDetailHeader } from "@/core/components/shared/UseDetailHeader";
import { ScholarShip, SocioEconomicLevel } from "@/core/enums";
import { socioLabel } from "@/core/utils/label";
import { DetailHeader } from "../components/HeaderDetail";
import {
  formatAddressLine1,
  formatAddressLine2,
  formatZipCode,
} from "../utils/format";
import { InfoField } from "@/core/components/layout";

export default function ParticipantDetail({
  participantId,
}: {
  participantId?: string;
}) {
  const {
    participantData: data,
    isLoading: loading,
    error: err,
    reload,
  } = useFetchParticipant({
    participantId,
  });

  const name = data?.fullName ?? "—";

  if (loading)
    return (
      <Box p={3}>
        <DatailLoading />
      </Box>
    );

  if (err) {
    return (
      <Box p={3} mx="auto">
        <DetailHeader title="Erro" participantId={participantId} />
        <Paper sx={{ p: 3 }}>
          <Typography color="error" gutterBottom>
            {err.message}
          </Typography>
          <Button onClick={reload} variant="outlined">
            Tentar novamente
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3} mx="auto">
        <DetailHeader title="Detalhes" participantId={participantId} />
        <Typography>Nenhum participante encontrado.</Typography>
      </Box>
    );
  }

  // Preparações de dados (View Model simples)
  const address1 = formatAddressLine1(data);
  const address2 = formatAddressLine2(data);
  const zipFormatted = formatZipCode(data.zipCode);
  const heightFormatted =
    typeof data.height === "number" ? `${fmtNumber(data.height)} cm` : null;
  const weightFormatted = data.weight ? `${fmtNumber(data.weight)} kg` : null;

  return (
    <Box p={3} sx={{ mx: "auto" }}>
      <DetailHeader
        title={name !== "—" ? name : "Detalhes"}
        participantId={participantId}
      />

      <Paper sx={{ p: 3 }}>
        {/* Cabeçalho do Card (Shared Component) */}
        <UserDetailHeader
          active={true}
          name={name}
          updatedAt={data.updatedAt}
          entity="Paciente"
        />

        <Divider sx={{ my: 3 }} />

        <UserDetailContent {...data} />

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <InfoField
            label="Data de nascimento"
            value={formatData(data.birthday)}
          />
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Seção 2: Saúde */}
        <Grid container spacing={2}>
          <InfoField label="Peso" value={weightFormatted} />
          <InfoField label="Altura" value={heightFormatted} />
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Seção 3: Escolaridade e Socioeconômico */}
        <Grid container spacing={2}>
          <InfoField
            label="Escolaridade"
            value={data.scholarship ? ScholarShip[data.scholarship] : null}
          />
          <InfoField
            label="Nível socioeconômico"
            value={
              data.socio_economic_level
                ? socioLabel(data.socio_economic_level as SocioEconomicLevel)
                : null
            }
          />
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Seção 4: Endereço */}
        <Grid container spacing={2}>
          <InfoField label="Endereço" value={address1} subValue={address2} />
          <InfoField label="CEP" value={zipFormatted} copyable />
        </Grid>
      </Paper>
    </Box>
  );
}
