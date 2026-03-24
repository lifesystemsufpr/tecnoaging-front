import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          component="button"
          onClick={() => router.push("/")}
          underline="hover"
          color="inherit"
        >
          Perfil
        </Link>
        <Typography color="text.primary">{"Detalhes"}</Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={1}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/")}>
          Voltar
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
          disabled={disableEdit}
        >
          Editar
        </Button>
      </Stack>
    </Stack>
  );
}
