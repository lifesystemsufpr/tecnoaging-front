import { Box, Button, Dialog } from "@/core/components/ui";
import { Participant } from "@/core/types";

interface DeleteParticipantProps {
  open: boolean;
  onClose: () => void;
  participant: Participant;
  onConfirm?: () => void;
}

export default function DeleteParticipant({
  open,
  onClose,
  participant,
  onConfirm,
}: DeleteParticipantProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Excluir Participante!"
      description={`Tem certeza que deseja excluir o participante ${participant.fullName}?`}
    >
      <Box display="flex" gap={24} justify="flex-end" mt={16}>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onConfirm?.();
          }}
        >
          Excluir
        </Button>
      </Box>
    </Dialog>
  );
}
