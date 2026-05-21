import { toast } from "sonner";
import DeleteEducationalUnit from "../components/DeleteEducationalUnit";
import { useEducationalUnitCrudContext } from "../contexts/EducationalUnitCrudContext";
import { useDeleteEducationalUnit } from "../hooks/educational-unit/useDeleteEducationalUnit";

export function ConfirmDeleteEducationalUnit() {
  const deleteMutation = useDeleteEducationalUnit();
  const { educationalUnitPendingDeletion, closeDeleteDialog } =
    useEducationalUnitCrudContext();

  const handleConfirmDelete = () => {
    if (educationalUnitPendingDeletion) {
      deleteMutation.mutate(educationalUnitPendingDeletion.id, {
        onSuccess: () => {
          toast.success("Instituicao excluida com sucesso!");
          closeDeleteDialog();
        },
      });
    }
  };

  return (
    <DeleteEducationalUnit
      open={true}
      onClose={closeDeleteDialog}
      educationalUnit={educationalUnitPendingDeletion}
      onConfirm={handleConfirmDelete}
    />
  );
}
