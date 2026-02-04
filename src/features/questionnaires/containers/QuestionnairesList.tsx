"use client";

import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { GenericTable } from "@/core/components/layout";
import { Participant, HealthProfessional } from "@/core/types";
import QuestionnaireListFilters from "../components/QuestionnaireListFilters";
import { QuestionnairesListProvider } from "../contexts/QuestionnairesListContext";
import useFetchQuestionnairesList from "../hooks/useFetchQuestionnairesList";
import { QuestionnaireListItem } from "../types/domain";
import { questionnaireListColumns } from "../utils/columns";
import QuestionnaireDetailDialog from "../components/QuestionnaireDetailDialog";

export function QuestionnairesList() {
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [selectedProfessional, setSelectedProfessional] =
    useState<HealthProfessional | null>(null);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<
    string | null
  >(null);

  const questionnairesState = useFetchQuestionnairesList({ pageSize: 10 });
  const {
    rows,
    totalRows,
    paginationModel,
    setPaginationModel,
    applyFilters,
    filters,
    isLoading,
    isFetching,
  } = questionnairesState;

  const contextValue = useMemo(
    () => ({
      rows,
      totalRows,
      paginationModel,
      setPaginationModel,
      applyFilters,
      filters,
      isLoading,
      isFetching,
      selectedParticipant,
      setSelectedParticipant,
      selectedProfessional,
      setSelectedProfessional,
    }),
    [
      rows,
      totalRows,
      paginationModel,
      setPaginationModel,
      applyFilters,
      filters,
      isLoading,
      isFetching,
      selectedParticipant,
      selectedProfessional,
      setSelectedParticipant,
      setSelectedProfessional,
    ]
  );

  const tableLoading = isLoading || isFetching;

  return (
    <QuestionnairesListProvider value={contextValue}>
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Questionarios
        </Typography>
        <QuestionnaireListFilters />
        <GenericTable<QuestionnaireListItem>
          columns={questionnaireListColumns}
          rows={rows}
          loading={tableLoading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          onView={(questionnaire) =>
            setSelectedQuestionnaireId(questionnaire.id)
          }
          totalRows={totalRows}
          pageSize={paginationModel.pageSize}
          autoHeight
        />
      </Box>

      {selectedQuestionnaireId && (
        <QuestionnaireDetailDialog
          open={Boolean(selectedQuestionnaireId)}
          questionnaireId={selectedQuestionnaireId}
          onClose={() => setSelectedQuestionnaireId(null)}
        />
      )}
    </QuestionnairesListProvider>
  );
}
