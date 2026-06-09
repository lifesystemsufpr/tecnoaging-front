import { ArrowLeft, Pencil } from "lucide-react";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Typography,
} from "@/core/components/ui";
import { useRouter } from "next/navigation";

export interface ProfileNavigationProps {
  onEdit: () => void;
  disableEdit?: boolean;
}

export function ProfileNavigation({
  onEdit,
  disableEdit = false,
}: ProfileNavigationProps) {
  const router = useRouter();

  return (
    <Box display="flex" justify="space-between" align="center" mb={16}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          as="button"
          type="button"
          onClick={() => router.push("/")}
          underline="hover"
          color="inherit"
        >
          Perfil
        </Link>
        <Typography className="text-foreground">Detalhes</Typography>
      </Breadcrumbs>

      <Box display="flex" gap={8}>
        <Button
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.push("/")}
        >
          Voltar
        </Button>
        {!disableEdit && (
          <Button
            variant="default"
            leftIcon={<Pencil className="h-4 w-4" />}
            onClick={onEdit}
            disabled={disableEdit}
          >
            Editar
          </Button>
        )}
      </Box>
    </Box>
  );
}
