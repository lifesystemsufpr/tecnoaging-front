import { Box, Button, Modal, Typography } from "@/core/components/ui";
import { useEducationalUnitCrudContext } from "../contexts/EducationalUnitCrudContext";
import EducationalUnitTable from "../containers/EducationalUnitTable";
import { EducationalUnitUpsertForm } from "../components/EducationalUnitUpsertForm";
import { ConfirmDeleteEducationalUnit } from "../containers/ConfirmDeleteEducationalUnit";

export function EducationalUnitCrudPage() {
  const {
    openCreateModal,
    isUpsertDialogOpen,
    closeUpsertModal,
    selectedEducationalUnit,
    isDeleteDialogOpen,
  } = useEducationalUnitCrudContext();

  return (
    <Box display="flex" direction="column" gap={12}>
      <Box
        display="flex"
        direction="row"
        justify="space-between"
        align="center"
      >
        <Typography variant="h4" color="secondary">
          Gerenciar Unidades de Ensino
        </Typography>

        <Button variant="default" onClick={openCreateModal}>
          Adicionar Unidade de Ensino
        </Button>
      </Box>

      <EducationalUnitTable />

      {isUpsertDialogOpen && (
        <Modal
          open={isUpsertDialogOpen}
          onClose={closeUpsertModal}
          hideCloseButton
        >
          <EducationalUnitUpsertForm
            editEducationalUnit={selectedEducationalUnit}
            onSuccess={closeUpsertModal}
          />
        </Modal>
      )}

      {isDeleteDialogOpen && <ConfirmDeleteEducationalUnit />}
    </Box>
  );
}
