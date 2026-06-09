import { Box, Button, Dialog } from "@/core/components/ui";
import { EducationUnit } from "../types";

interface DeleteEducationalUnitProps {
  open: boolean;
  onClose: () => void;
  educationalUnit: EducationUnit;
  onConfirm?: () => void;
}

export default function DeleteEducationalUnit({
  open,
  onClose,
  educationalUnit,
  onConfirm,
}: DeleteEducationalUnitProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Excluir Instituição de Ensino!"
      description={`Tem certeza que deseja excluir a Instituição de Ensino ${educationalUnit.title}?`}
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
