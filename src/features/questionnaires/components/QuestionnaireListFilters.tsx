"use client";
import { HealthProfessional, Participant } from "@/core/types";
import { ParticipantAutocomplete } from "@/features/participants/components/ParticipantAutocomplete";
import ProfessionalAutocomplete from "@/features/professionals/components/ProfessionalAutocomplete";
import { Grid } from "@mui/material";
import { useState } from "react";

export default function QuestionnaireListFilters() {
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [selectedProfessional, setSelectedProfessional] =
    useState<HealthProfessional | null>(null);

  return (
    <Grid container spacing={2} mb={2}>
      <Grid size={6}>
        <ParticipantAutocomplete
          value={selectedParticipant}
          onChange={setSelectedParticipant}
        />
      </Grid>
      <Grid size={6}>
        <ProfessionalAutocomplete
          value={selectedProfessional}
          onChange={setSelectedProfessional}
        />
      </Grid>
    </Grid>
  );
}
