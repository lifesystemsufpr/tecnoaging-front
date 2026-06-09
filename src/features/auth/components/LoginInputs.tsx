import { Box, Grid, Input, Label } from "@/core/components/ui";
import { Eye, EyeOff } from "lucide-react";
import { FormData } from "../containers/LoginForm";
import { useState } from "react";

interface LoginInputsProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: Partial<FormData>;
  handleLogin: () => void;
}

export function LoginInputs({
  onChange,
  error,
  handleLogin,
}: LoginInputsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box>
      <Grid container spacing={16}>
        <Grid item xs={12} spacing={8}>
          <Box display="flex" direction="column" gap={8}>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              required
              className="p-2"
              mask="cpf"
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              onChange={onChange}
              errorMessage={error.cpf}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" direction="column" gap={8}>
            <Label htmlFor="password">Senha</Label>
            <Input
              required
              className="p-2"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Digite sua senha"
              size="md"
              rightElement={
                <Box
                  className="cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {!showPassword ? (
                    <EyeOff size={20} color="#1C54F2" />
                  ) : (
                    <Eye size={20} color="#1C54F2" />
                  )}
                </Box>
              }
              onChange={onChange}
              errorMessage={error.password}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
