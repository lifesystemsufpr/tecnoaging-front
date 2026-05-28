import { Box, Button, Dialog } from "@/core/components/ui";
import { HealthProfessional } from "@/core/types";

interface DeleteProfessionalProps {
  open: boolean;
  onClose: () => void;
  professional: HealthProfessional;
  onConfirm?: () => void;
}

export default function DeleteProfessional({
  open,
  onClose,
  professional,
  onConfirm,
}: DeleteProfessionalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Excluir Profissional!"
      description={`Tem certeza que deseja excluir o profissional ${professional.fullName}?`}
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
