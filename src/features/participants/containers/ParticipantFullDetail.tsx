"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@/core/components/ui";

import { UserDetailContent, UserDetailHeader } from "@/core/components/shared";

import DatailLoading from "../components/DatailLoading";
import { useFetchParticipant } from "../hooks/useFetchParticipant";
import { DetailHeader } from "../components/HeaderDetail";
import { DetailParticipantCard } from "../components/DetailParticipantCard";

import ParticipantQuestionnaires from "@/features/questionnaires/containers/ParticipantQuestionnaires";
import ParticipantEvaluations from "@/features/evaluations/containers/ParticipantEvaluations";
import { QuestionnairesProvider } from "@/features/questionnaires";

export default function ParticipantFullDetail({
  participantId,
}: {
  participantId?: string;
}) {
  const {
    data: data,
    isLoading: loading,
    error: err,
    refetch: reload,
  } = useFetchParticipant({
    participantId,
  });
  const [tab, setTab] = useState<number>(0);

  if (loading)
    return (
      <Box p={24}>
        <DatailLoading />
      </Box>
    );

  if (err) {
    return (
      <Box p={24} mx="auto">
        <DetailHeader title="Erro" />
        <Card padding="md">
          <Typography className="text-destructive">{err.message}</Typography>
          <Button onClick={() => reload()} variant="outline">
            Tentar novamente
          </Button>
        </Card>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={24} mx="auto">
        <DetailHeader title="Detalhes" />
        <Typography>Nenhum participante encontrado.</Typography>
      </Box>
    );
  }
  const handleChangeTab = (newValue: number) => {
    setTab(newValue);
  };

  const name = data?.fullName ?? "—";
  const effectiveParticipantId = participantId ?? data.id;

  return (
    <Box p={24} mx="auto">
      <DetailHeader title={name !== "—" ? name : "Detalhes"} />

      <Card variant="elevated" padding="md" className="border-0">
        <UserDetailHeader
          active={true}
          name={name}
          updatedAt={data.updatedAt}
          entity="Paciente"
        />
        <Tabs value={tab} onChange={handleChangeTab} variant="scrollable">
          <Box mt={24}>
            <TabList ariaLabel="Detalhes do participante">
              <Tab label="Dados Pessoais" value={0} />
              <Tab label="Histórico de Questionários" value={1} />
              <Tab label="Histórico de Avaliações" value={2} />
            </TabList>
          </Box>

          <TabPanel value={0}>
            <UserDetailContent userData={data} />
            <DetailParticipantCard data={data} />
          </TabPanel>

          <TabPanel value={1}>
            <QuestionnairesProvider patientId={effectiveParticipantId}>
              <ParticipantQuestionnaires withHeader={false} />
            </QuestionnairesProvider>
          </TabPanel>

          <TabPanel value={2}>
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
          </TabPanel>
        </Tabs>
      </Card>
    </Box>
  );
}
