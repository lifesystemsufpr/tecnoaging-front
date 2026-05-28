import { toast } from "sonner";
import DeleteResearcher from "../components/DeleteResearcher";
import { useResearcherCrudContext } from "../contexts/ResearcherListContext";
import { useDeleteResearcher } from "../hooks/useDeleteResearcher";

export function ConfirmDelete() {
  const deleteMutation = useDeleteResearcher();
  const { researcherPendingDeletion, closeDeleteDialog } =
    useResearcherCrudContext();

  const handleConfirmDelete = () => {
    if (researcherPendingDeletion) {
      deleteMutation.mutate(researcherPendingDeletion.id, {
        onSuccess: () => {
          toast.success("Pesquisador excluído com sucesso!");
          closeDeleteDialog();
        },
      });
    }
  };

  return (
    <DeleteResearcher
      open={true}
      onClose={closeDeleteDialog}
      researcher={researcherPendingDeletion}
      onConfirm={handleConfirmDelete}
    />
  );
}
