import { toast } from "sonner";
import DeleteProfessional from "../components/DeleteProfessional";
import { useProfessionalCrudContext } from "../contexts/ProfessionalCrudContext";
import { useDeleteProfessional } from "../hooks/useDeleteProfessional";

export function ConfirmDelete() {
  const deleteMutation = useDeleteProfessional();
  const { professionalPendingDeletion, closeDeleteDialog } =
    useProfessionalCrudContext();

  const handleConfirmDelete = () => {
    if (professionalPendingDeletion) {
      deleteMutation.mutate(professionalPendingDeletion.id, {
        onSuccess: () => {
          toast.success("Profissional excluido com sucesso!");
          closeDeleteDialog();
        },
      });
    }
  };

  return (
    <DeleteProfessional
      open={true}
      onClose={closeDeleteDialog}
      professional={professionalPendingDeletion}
      onConfirm={handleConfirmDelete}
    />
  );
}
