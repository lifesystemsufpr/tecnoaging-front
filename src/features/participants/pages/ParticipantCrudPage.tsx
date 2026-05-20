"use client";

import { Box, Button, Modal, Typography } from "@/core/components/ui";
import { useParticipantCrudContext } from "../contexts/ParticipantCrudContext";
import ParticipantTable from "../containers/ParticipantTable";
import { ParticipantUpsertForm } from "../components/ParticipantUpsertForm";
import { ConfirmDelete } from "../containers/ConfirmDelete";

export function ParticipantCrudPage() {
  const {
    openCreateModal,
    closeUpsertModal,
    isUpsertDialogOpen,
    selectedParticipant,
    isDeleteDialogOpen,
  } = useParticipantCrudContext();

  return (
    <Box display="flex" direction="column" gap={12}>
      <Box
        display="flex"
        direction="row"
        justify="space-between"
        align="center"
      >
        <Typography variant="h4" color="secondary">
          Gerenciar Participantes
        </Typography>

        <Button variant="default" onClick={openCreateModal}>
          Adicionar Participante
        </Button>
      </Box>

      <ParticipantTable />

      {isUpsertDialogOpen && (
        <Modal
          open={isUpsertDialogOpen}
          onClose={closeUpsertModal}
          hideCloseButton
        >
          <ParticipantUpsertForm
            editUser={selectedParticipant}
            onSuccess={closeUpsertModal}
          />
        </Modal>
      )}

      {isDeleteDialogOpen && <ConfirmDelete />}
    </Box>
  );
}
