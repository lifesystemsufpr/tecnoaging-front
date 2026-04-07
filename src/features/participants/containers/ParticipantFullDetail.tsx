"use client";

import { useState } from "react";
import {
  Box,
  Divider,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
} from "@mui/material";

import DatailLoading from "../components/DatailLoading";
import { useFetchParticipant } from "../hooks/useFetchParticipant";

import { DetailHeader } from "../components/HeaderDetail";

import ParticipantQuestionnaires from "@/features/questionnaires/containers/ParticipantQuestionnaires";
import ParticipantEvaluations from "@/features/evaluations/containers/ParticipantEvaluations";
import { QuestionnairesProvider } from "@/features/questionnaires";

import { UserDetailContent, UserDetailHeader } from "@/core/components/shared";
import { DetailParticipantCard } from "../components/DetailParticipantCard";

export default function ParticipantFullDetail({
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

            <UserDetailContent userData={data} />
            <DetailParticipantCard data={data} />
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
