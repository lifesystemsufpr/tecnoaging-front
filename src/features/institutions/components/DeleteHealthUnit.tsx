import { Box, Button, Dialog } from "@/core/components/ui";
import { HealthUnit } from "../types";

interface DeleteHealthUnitProps {
  open: boolean;
  onClose: () => void;
  healthUnit: HealthUnit;
  onConfirm?: () => void;
}

export default function DeleteHealthUnit({
  open,
  onClose,
  healthUnit,
  onConfirm,
}: DeleteHealthUnitProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Excluir Unidade de Saude!"
      description={`Tem certeza que deseja excluir a unidade ${healthUnit.name}?`}
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
