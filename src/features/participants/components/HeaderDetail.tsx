import {
  Breadcrumbs,
  Link as MUILink,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import ROUTES from "@/core/config/client.routes";

interface HeaderProps {
  title: string;
}

export function DetailHeader({ title }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => router.push(ROUTES.USERS.PARTICIPANTS.MAIN);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Breadcrumbs aria-label="breadcrumb">
        <MUILink
          component="button"
          onClick={handleBack}
          underline="hover"
          color="inherit"
        >
          Participantes
        </MUILink>
        <Typography color="text.primary">{title}</Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={1}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Voltar
        </Button>
      </Stack>
    </Stack>
  );
}
