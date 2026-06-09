import { toast } from "sonner";
import DeleteParticipant from "../components/DeleteParticipant";
import { useParticipantCrudContext } from "../contexts/ParticipantCrudContext";
import { useDeleteParticipant } from "../hooks/useDeleteParticipant";

export function ConfirmDelete() {
  const deleteMutation = useDeleteParticipant();
  const { participantPendingDeletion, closeDeleteDialog } =
    useParticipantCrudContext();

  const handleConfirmDelete = () => {
    if (participantPendingDeletion) {
      deleteMutation.mutate(participantPendingDeletion.id, {
        onSuccess: () => {
          toast.success("Participante excluido com sucesso!");
          closeDeleteDialog();
        },
      });
    }
  };

  return (
    <DeleteParticipant
      open={true}
      onClose={closeDeleteDialog}
      participant={participantPendingDeletion}
      onConfirm={handleConfirmDelete}
    />
  );
}
