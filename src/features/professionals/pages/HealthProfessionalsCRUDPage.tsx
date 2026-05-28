import { Box, Button, Modal, Typography } from "@/core/components/ui";
import ProfessionalTable from "../containers/ProfessionalTable";
import { useProfessionalCrudContext } from "../contexts/ProfessionalCrudContext";
import { ProfessionalUpsertForm } from "../components/ProfessionalUpsertForm";
import { ConfirmDelete } from "../containers/ConfirmDelete";

export function HealthProfessionalsCrudPage() {
  const {
    openCreateModal,
    isUpsertDialogOpen,
    closeUpsertModal,
    selectedProfessional,
    isDeleteDialogOpen,
  } = useProfessionalCrudContext();

  return (
    <Box display="flex" direction="column" gap={12}>
      <Box
        display="flex"
        direction="row"
        justify="space-between"
        align="center"
      >
        <Typography variant="h4" color="secondary">
          Gerenciar Profissionais de Saúde
        </Typography>

        <Button variant="default" onClick={openCreateModal}>
          Adicionar Profissional
        </Button>
      </Box>

      <ProfessionalTable />

      {isUpsertDialogOpen && (
        <Modal
          open={isUpsertDialogOpen}
          onClose={closeUpsertModal}
          hideCloseButton
        >
          <ProfessionalUpsertForm
            editUser={selectedProfessional}
            onSuccess={closeUpsertModal}
          />
        </Modal>
      )}

      {isDeleteDialogOpen && <ConfirmDelete />}
    </Box>
  );
}
