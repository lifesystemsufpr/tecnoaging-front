"use client";

import { useQueryClient } from "@tanstack/react-query";

import { Box, Button, Dialog, Modal, Typography } from "@/core/components/ui";
import ResearcherTable from "../containers/ResearcherTable";
import { ResearcherUpsertForm } from "../components/ResearcherUpsertForm";
import {
  ResearcherCrudProvider,
  useResearcherCrudContext,
} from "../contexts/ResearcherListContext";

function ResearcherCRUDContent() {
  const {
    isUpsertDialogOpen,
    selectedResearcher,
    openCreateModal,
    openDeleteDialog,
    openEditModal,
    closeUpsertModal,
    isEditing,
  } = useResearcherCrudContext();

  return (
    <Box display="flex" direction="column" gap={12}>
      <Box
        display="flex"
        direction="row"
        justify="space-between"
        align="center"
      >
        <Typography variant="h4" color="secondary">
          Gerenciar Pesquisadores
        </Typography>

        <Button variant="default" onClick={openCreateModal}>
          Adicionar Pesquisador
        </Button>
      </Box>

      <ResearcherTable />

      <Modal
        open={isUpsertDialogOpen}
        onClose={closeUpsertModal}
        hideCloseButton
      >
        <ResearcherUpsertForm
          editUser={selectedResearcher}
          onSuccess={closeUpsertModal}
        />
      </Modal>
    </Box>
  );
}

export function ResearcherCRUD() {
  return (
    <ResearcherCrudProvider>
      <ResearcherCRUDContent />
    </ResearcherCrudProvider>
  );
}
