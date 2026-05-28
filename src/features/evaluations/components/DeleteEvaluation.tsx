import { Box, Button, Dialog } from "@/core/components/ui";
import { Evaluation } from "../types/Evaluation.types";

interface DeleteEvaluationProps {
  open: boolean;
  onClose: () => void;
  evaluation?: Evaluation | null;
  onConfirm?: () => void;
}

export default function DeleteEvaluation({
  open,
  onClose,
  evaluation,
  onConfirm,
}: DeleteEvaluationProps) {
  const participantName = evaluation?.participant?.fullName;
  const description = participantName
    ? `Tem certeza que deseja excluir a avaliacao de ${participantName}?`
    : "Tem certeza que deseja excluir esta avaliacao?";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Excluir Avaliacao!"
      description={description}
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
