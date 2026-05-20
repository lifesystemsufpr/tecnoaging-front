"use client";

import { Box, Button, Modal, Typography } from "@/core/components/ui";
import { useHealthUnitCrudContext } from "../contexts/HealthUnitCrudContext";
import HealthUnitTable from "../containers/HealthUnitTable";
import { HealthUnitUpsertForm } from "../components/HealthUnitUpsertForm";
import { ConfirmDelete } from "../containers/ConfirmDelete";

export function HealthUnitCrudPage() {
  const {
    openCreateModal,
    isUpsertDialogOpen,
    closeUpsertModal,
    selectedHealthUnit,
    isDeleteDialogOpen,
  } = useHealthUnitCrudContext();

  return (
    <Box display="flex" direction="column" gap={12}>
      <Box
        display="flex"
        direction="row"
        justify="space-between"
        align="center"
      >
        <Typography variant="h4" color="secondary">
          Gerenciar Unidades de Saúde
        </Typography>

        <Button variant="default" onClick={openCreateModal}>
          Adicionar Unidade de Saúde
        </Button>
      </Box>

      <HealthUnitTable />

      {isUpsertDialogOpen && (
        <Modal
          open={isUpsertDialogOpen}
          onClose={closeUpsertModal}
          hideCloseButton
        >
          <HealthUnitUpsertForm
            editHealthUnit={selectedHealthUnit}
            onSuccess={closeUpsertModal}
          />
        </Modal>
      )}

      {isDeleteDialogOpen && <ConfirmDelete />}
    </Box>
  );
}
