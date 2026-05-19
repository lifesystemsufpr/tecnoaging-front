import { Box, Button, Dialog } from "@/core/components/ui";
import { Researcher } from "@/core/types";

interface DeleteResearcherProps {
  open: boolean;
  onClose: () => void;
  researcher: Researcher;
  onConfirm?: () => void;
}

export default function DeleteResearcher({
  open,
  onClose,
  researcher,
  onConfirm,
}: DeleteResearcherProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Excluir Pesquisador!"
      description={`Tem certeza que deseja excluir o pesquisador ${researcher.fullName}?`}
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
