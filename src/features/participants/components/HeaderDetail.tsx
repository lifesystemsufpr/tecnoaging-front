import { ArrowLeft } from "lucide-react";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Typography,
} from "@/core/components/ui";
import { useRouter } from "next/navigation";
import ROUTES from "@/core/config/client.routes";

interface HeaderProps {
  title: string;
}

export function DetailHeader({ title }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => router.push(ROUTES.USERS.PARTICIPANTS.MAIN);

  return (
    <Box display="flex" justify="space-between" align="center" mb={16}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          as="button"
          type="button"
          onClick={handleBack}
          underline="hover"
          color="inherit"
        >
          Participantes
        </Link>
        <Typography className="text-foreground">{title}</Typography>
      </Breadcrumbs>

      <Box display="flex" gap={8}>
        <Button
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={handleBack}
        >
          Voltar
        </Button>
      </Box>
    </Box>
  );
}
