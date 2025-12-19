import { healthUnitSchema, UF_LIST } from "@/lib/validators/health-unit";
import { HealthUnit } from "@/types/domain/Health-unit";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { FormContainer } from "../container/FormProvider";

const onlyDigits = (v: string) => (v || "").replace(/\D/g, "");
const formatCEP = (v: string) => {
  const d = onlyDigits(v).slice(0, 8); // limita a 8 dígitos
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
};

interface HealthUnitFormProps {
  onSubmit?: (data: Partial<HealthUnit>) => void;
  initialValues?: Partial<HealthUnit>;
  submitLabel?: string;
}

type HealthUnitFormData = z.infer<typeof healthUnitSchema>;

export function HealthUnitForm({
  onSubmit,
  initialValues,
  submitLabel = "Salvar",
}: HealthUnitFormProps) {
  const [cepLoading, setCepLoading] = useState(false);

  const defaultValues: HealthUnitFormData = useMemo(
    () => ({
      id: initialValues?.id ?? undefined,
      name: initialValues?.name ?? "",
      zipCode: (initialValues?.zipCode ?? "").replace(/\D/g, "").slice(0, 8),
      street: initialValues?.street ?? "",
      number: initialValues?.number?.toString?.() ?? "",
      complement: initialValues?.complement ?? "",
      city: initialValues?.city ?? "",
      state: (initialValues?.state as HealthUnitFormData["state"]) ?? "",
      neighborhood: initialValues?.neighborhood ?? "",
    }),
    [initialValues]
  );

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<HealthUnitFormData>({
    resolver: zodResolver(healthUnitSchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleCepLookup = useCallback(
    async (raw: string) => {
      const cep = (raw || "").replace(/\D/g, "");
      if (cep.length !== 8) {
        setError("zipCode", {
          type: "manual",
          message: "CEP deve ter 8 dígitos",
        });
        return;
      }

      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();

        if (data?.erro) {
          setError("zipCode", {
            type: "manual",
            message: "CEP não encontrado",
          });
          setValue("street", "");
          setValue("neighborhood", "");
          setValue("city", "");
          setValue("state", "");
          return;
        }

        clearErrors("zipCode");
        setValue("street", data.logradouro ?? "");
        setValue("neighborhood", data.bairro ?? "");
        setValue("city", data.localidade ?? "");
        setValue("state", (data.uf ?? "").toUpperCase());
      } catch {
        setError("zipCode", {
          type: "manual",
          message: "Erro ao consultar CEP",
        });
      } finally {
        setCepLoading(false);
      }
    },
    [clearErrors, setError, setValue]
  );

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit || (() => {}))}>
      <Box mb={3}>
        <Typography variant="h6">
          {initialValues
            ? `Editar Unidade de Saúde`
            : `Cadastrar Unidade de Saúde`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {initialValues
            ? "Altere as informações necessárias e salve as alterações."
            : "Preencha os dados abaixo para registrar uma nova unidade no sistema."}
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {/* --- Informações Básicas --- */}
        <Grid size={12}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Nome da Unidade"
                fullWidth
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                autoComplete="organization"
              />
            )}
          />
        </Grid>

        {/* --- Localização --- */}
        {/* CEP - Ocupa menos espaço que a rua */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Controller
            name="zipCode"
            control={control}
            rules={{
              required: "CEP é obrigatório",
              validate: (v) => onlyDigits(v).length === 8 || "CEP inválido",
            }}
            render={({ field }) => (
              <TextField
                label="CEP"
                required
                fullWidth
                value={formatCEP(field.value ?? "")}
                onChange={(e) => {
                  const digits = onlyDigits(e.target.value).slice(0, 8);
                  field.onChange(digits);
                  if (errors.zipCode) clearErrors("zipCode");
                }}
                onBlur={() => handleCepLookup(field.value ?? "")}
                error={!!errors.zipCode}
                helperText={errors.zipCode?.message}
                InputProps={{
                  endAdornment: cepLoading && (
                    <InputAdornment position="end">
                      <CircularProgress size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Rua - Ocupa o restante da linha do CEP */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Controller
            name="street"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Logradouro (Rua/Avenida)"
                fullWidth
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        {/* Número - Curto */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <Controller
            name="number"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Número"
                fullWidth
                required
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/\D/g, ""))
                }
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        {/* Complemento - Médio */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Controller
            name="complement"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Complemento"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        {/* Bairro - Médio */}
        <Grid size={{ xs: 12, sm: 5 }}>
          <Controller
            name="neighborhood"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Bairro"
                fullWidth
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        {/* Cidade - Largo */}
        <Grid size={{ xs: 12, sm: 9 }}>
          <Controller
            name="city"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Cidade"
                fullWidth
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        {/* UF - Pequeno */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <Controller
            name="state"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="UF"
                fullWidth
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              >
                {UF_LIST.map((uf) => (
                  <MenuItem key={uf} value={uf}>
                    {uf}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ px: 4 }}
        >
          {isSubmitting ? "Salvando..." : submitLabel}
        </Button>
      </Stack>
    </FormContainer>
  );
}
