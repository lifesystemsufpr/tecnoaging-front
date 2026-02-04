"use client";
import { ParticipantAutocomplete } from "@/features/participants/components/ParticipantAutocomplete";
import ProfessionalAutocomplete from "@/features/professionals/components/ProfessionalAutocomplete";
import { Button, Grid } from "@mui/material";
import { useQuestionnairesListContext } from "../contexts/QuestionnairesListContext";

export default function QuestionnaireListFilters() {
  const {
    selectedParticipant,
    setSelectedParticipant,
    selectedProfessional,
    setSelectedProfessional,
    applyFilters,
    isLoading,
    isFetching,
  } = useQuestionnairesListContext();

  const handleApplyFilters = () => {
    applyFilters({
      participantCpf: selectedParticipant?.cpf,
      healthProfessionalCpf: selectedProfessional?.cpf,
    });
  };

  return (
    <Grid container spacing={2} mb={2} alignItems="center">
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
      <Grid size={12}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleApplyFilters}
          disabled={isLoading || isFetching}
        >
          Aplicar filtro
        </Button>
      </Grid>
    </Grid>
  );
}
