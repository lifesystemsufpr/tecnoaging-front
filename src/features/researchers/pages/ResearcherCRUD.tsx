"use client";

import { Box, Button, Modal, Typography } from "@/core/components/ui";
import ResearcherTable from "../containers/ResearcherTable";
import { ResearcherUpsertForm } from "../components/ResearcherUpsertForm";
import { useResearcherCrudContext } from "../contexts/ResearcherListContext";
import { ConfirmDelete } from "../containers/ConfirmDelete";

export function ResearcherCrudPage() {
  const {
    isUpsertDialogOpen,
    selectedResearcher,
    openCreateModal,
    isDeleteDialogOpen,
    closeUpsertModal,
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

      {isUpsertDialogOpen && (
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
      )}

      {isDeleteDialogOpen && <ConfirmDelete />}
    </Box>
  );
}
