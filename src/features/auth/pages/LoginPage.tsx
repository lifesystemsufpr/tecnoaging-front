import { Box, Typography } from "@/core/components/ui";
import LoginForm from "../containers/LoginForm";

export function LoginPage() {
  return (
    <Box display="flex" direction="column" gap={12} className="w-[47%]">
      <LoginForm />
      <Typography variant="small" className="text-center">
        Versão {process.env.VERSION || "0.0.2"}
      </Typography>
    </Box>
  );
}
