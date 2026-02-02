"use client";

import { useState } from "react";
import {
  Box,
  Divider,
  Paper,
  Typography,
  Button,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";

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
import ParticipantQuestionnaires from "@/features/questionnaires/containers/ParticipantQuestionnaires";
import ParticipantEvaluations from "@/features/evaluations/containers/ParticipantEvaluations";
import { QuestionnairesProvider } from "@/features/questionnaires";

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
  const [tab, setTab] = useState<number>(0);

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

  const name = data?.fullName ?? "—";
  const address1 = formatAddressLine1(data);
  const address2 = formatAddressLine2(data);
  const zipFormatted = formatZipCode(data.zipCode);
  const heightFormatted =
    typeof data.height === "number" ? `${fmtNumber(data.height)} cm` : null;
  const weightFormatted = data.weight ? `${fmtNumber(data.weight)} kg` : null;
  const effectiveParticipantId = participantId ?? data.id;

  return (
    <Box p={3} sx={{ mx: "auto" }}>
      <DetailHeader
        title={name !== "—" ? name : "Detalhes"}
        participantId={effectiveParticipantId}
      />

      <Paper sx={{ p: 3 }}>
        <UserDetailHeader
          active={true}
          name={name}
          updatedAt={data.updatedAt}
          entity="Paciente"
        />
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ mt: 3 }}
          variant="scrollable"
          allowScrollButtonsMobile
        >
          <Tab label="Dados Pessoais" value={0} />
          <Tab label="Histórico de Questionários" value={1} />
          <Tab label="Histórico de Avaliações" value={2} />
        </Tabs>

        {tab === 0 && (
          <>
            <Divider sx={{ my: 3 }} />

            <UserDetailContent {...data} />

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <InfoField
                label="Data de nascimento"
                value={formatData(data.birthday)}
              />
              <InfoField label="Peso" value={weightFormatted} />
              <InfoField label="Altura" value={heightFormatted} />
              <InfoField
                label="Escolaridade"
                value={data.scholarship ? ScholarShip[data.scholarship] : null}
              />
              <InfoField
                label="Nível socioeconômico"
                value={
                  data.socio_economic_level
                    ? socioLabel(
                        data.socio_economic_level as SocioEconomicLevel
                      )
                    : null
                }
              />
              <InfoField
                label="Endereço"
                value={address1}
                subValue={address2}
              />
              <InfoField label="CEP" value={zipFormatted} copyable />
            </Grid>
          </>
        )}

        {tab === 1 && (
          <QuestionnairesProvider patientId={effectiveParticipantId}>
            <Divider sx={{ my: 3 }} />
            <ParticipantQuestionnaires withHeader={false} />
          </QuestionnairesProvider>
        )}

        {tab === 2 && (
          <>
            <Divider sx={{ my: 3 }} />
            {effectiveParticipantId ? (
              <ParticipantEvaluations
                participantId={effectiveParticipantId}
                withHeader={false}
              />
            ) : (
              <Typography>
                Identificador do participante não disponível.
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
