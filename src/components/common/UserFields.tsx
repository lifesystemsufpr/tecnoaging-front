"use client";

import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type { UserFormData } from "@/lib/validators/user";
import { GENDER } from "@/types/enums/gender";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

/** CPF -> 000.000.000-00 */
const maskCPF = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  let out = d;
  if (out.length > 3) out = out.replace(/^(\d{3})(\d)/, "$1.$2");
  if (out.length > 6) out = out.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  if (out.length > 9)
    out = out.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
  return out;
};

/** Telefone BR celular -> (00) 90000-0000 (11 digitos) */
const maskPhoneBR = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  let out = d.replace(/^(\d{2})(\d)/, "($1) $2");
  out = out.replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  return out;
};

const genderToBr = (g: string) => {
  switch (g) {
    case "MALE":
      return "Masculino";
    case "FEMALE":
      return "Feminino";
    case "OTHER":
      return "Outro";
    default:
      return g;
  }
};

export default function UserFields({ isEdit = false }) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<UserFormData>();

  const cpfReg = register("cpf");
  const phoneReg = register("phone");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box>
      <Box>
        <TextField
          label="Nome Completo"
          fullWidth
          margin="normal"
          required
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          {...register("fullName")}
        />
      </Box>

      <Box mt={2} sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="CPF"
          fullWidth
          inputProps={{ maxLength: 14 }}
          required
          margin="normal"
          error={!!errors.cpf}
          helperText={errors.cpf?.message}
          {...cpfReg}
          onChange={(e) => {
            const masked = maskCPF(e.target.value);
            setValue("cpf", masked, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
        <TextField
          label="Senha"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register("password")}
          required={!isEdit}
        />
      </Box>

      <Box mt={2} sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Telefone"
          fullWidth
          margin="normal"
          required
          error={!!errors.phone}
          helperText={errors.phone?.message}
          inputProps={{ maxLength: 16 }}
          {...phoneReg}
          onChange={(e) => {
            const masked = maskPhoneBR(e.target.value);
            setValue("phone", masked, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <TextField
              label="Genero"
              select
              fullWidth
              margin="normal"
              error={!!errors.gender}
              helperText={errors.gender?.message}
              {...field}
            >
              {Object.entries(GENDER).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {genderToBr(value)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>
    </Box>
  );
}
