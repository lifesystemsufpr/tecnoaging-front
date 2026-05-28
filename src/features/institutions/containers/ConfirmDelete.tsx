import { toast } from "sonner";
import DeleteHealthUnit from "../components/DeleteHealthUnit";
import { useHealthUnitCrudContext } from "../contexts/HealthUnitCrudContext";
import { useDeleteHealthUnit } from "../hooks/health-unit/useDeleteHealthUnit";

export function ConfirmDelete() {
  const deleteMutation = useDeleteHealthUnit();
  const { healthUnitPendingDeletion, closeDeleteDialog } =
    useHealthUnitCrudContext();

  const handleConfirmDelete = () => {
    if (healthUnitPendingDeletion) {
      deleteMutation.mutate(healthUnitPendingDeletion.id, {
        onSuccess: () => {
          toast.success("Unidade excluida com sucesso!");
          closeDeleteDialog();
        },
      });
    }
  };

  return (
    <DeleteHealthUnit
      open={true}
      onClose={closeDeleteDialog}
      healthUnit={healthUnitPendingDeletion}
      onConfirm={handleConfirmDelete}
    />
  );
}
