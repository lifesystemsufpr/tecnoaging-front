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
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

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
      state:
        (initialValues?.state as HealthUnitFormData["state"]) ?? ("" as any),
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
          setValue("state", "" as any);
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
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit((values) => onSubmit?.(values))}
    >
      <Grid container spacing={2}>
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

        {/* CEP */}
        <Grid size={12}>
          <Controller
            name="zipCode"
            control={control}
            rules={{
              required: "CEP é obrigatório",
              validate: (v) =>
                onlyDigits(v).length === 8 || "CEP deve ter 8 dígitos",
            }}
            render={({ field }) => {
              const masked = formatCEP(field.value ?? "");
              return (
                <TextField
                  label="CEP"
                  margin="normal"
                  required
                  fullWidth
                  value={masked}
                  onChange={(e) => {
                    const digits = onlyDigits(e.target.value).slice(0, 8);
                    field.onChange(digits);
                    if (errors.zipCode) clearErrors("zipCode");
                  }}
                  onBlur={() => handleCepLookup(field.value ?? "")}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode?.message}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 9,
                    autoComplete: "postal-code",
                  }}
                  onKeyDown={(e) => {
                    const allowed = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                      "Home",
                      "End",
                    ];
                    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  InputProps={{
                    endAdornment: cepLoading ? (
                      <InputAdornment position="end">
                        <CircularProgress size={18} />
                      </InputAdornment>
                    ) : null,
                  }}
                />
              );
            }}
          />
        </Grid>

        {/* Rua */}
        <Grid size={12}>
          <Controller
            name="street"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Rua"
                fullWidth
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                autoComplete="address-line1"
              />
            )}
          />
        </Grid>

        {/* Número */}
        <Grid size={12}>
          <Controller
            name="number"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Número"
                fullWidth
                required
                inputProps={{ inputMode: "numeric" }}
                onChange={(e) => {
                  // mantém como string mas só com dígitos
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  field.onChange(onlyDigits);
                }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                autoComplete="address-line2"
              />
            )}
          />
        </Grid>

        {/* Complemento */}
        <Grid size={12}>
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
                autoComplete="address-line3"
              />
            )}
          />
        </Grid>

        {/* Cidade */}
        <Grid size={12}>
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
                autoComplete="address-level2"
              />
            )}
          />
        </Grid>

        {/* Bairro */}
        <Grid size={12}>
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
                autoComplete="address-level3"
              />
            )}
          />
        </Grid>

        {/* UF */}
        <Grid size={12}>
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

      <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
