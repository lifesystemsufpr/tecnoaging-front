import ROUTES from "@/core/config/client.routes";
import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function QuestionnaireHeader() {
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
          onClick={() => router.push(ROUTES.USERS.PARTICIPANTS.MAIN)}
          underline="hover"
          color="inherit"
        >
          Participante
        </Link>
        <Typography color="text.primary">
          Questionários do Participante
        </Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={1}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
          Voltar
        </Button>
      </Stack>
    </Stack>
  );
}
