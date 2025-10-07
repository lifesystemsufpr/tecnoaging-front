import UserFields from "@/components/common/UserFields";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { SocioEconomicLevel } from "@/types/enums/socio-economic-level";
import { ScholarShip } from "@/types/enums/scholar-ship";
import { useCallback, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PatientFormData } from "@/lib/validators/user";
import { UF_LIST } from "@/lib/validators/health-unit";
import { socioLabel } from "@/utils/socioEconomic";

interface PatientFormProps {
  isEdit: boolean;
}

const onlyDigits = (v: string) => (v || "").replace(/\D/g, "");
const formatCEP = (v: string) => {
  const d = onlyDigits(v).slice(0, 8); // limita a 8 dígitos
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
};

export default function PatientForm({ isEdit }: PatientFormProps) {
  const [step, setStep] = useState(0);
  const [cepLoading, setCepLoading] = useState(false);

  const {
    register,
    setValue,
    setError,
    control,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext<PatientFormData>();

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
          setValue("state", "");
          setValue("city", "");
          setValue("neighborhood", "");
          setValue("street", "");
          return;
        }

        clearErrors("zipCode");
        setValue("state", data.uf || "");
        setValue("city", data.localidade || "");
        setValue("neighborhood", data.bairro || "");
        setValue("street", data.logradouro || "");
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

  const step0Fields: Array<keyof PatientFormData | `${string}.${string}`> = [
    "birthDate",
    "weight",
    "height",
    "fullName",
    "cpf",
    "phone",
    "password",
  ];

  const handleNextStep = async () => {
    const ok = await trigger(step0Fields as any, { shouldFocus: true });
    if (ok) setStep(1);
  };

  return (
    <Box>
      <Box sx={{ display: step === 0 ? "block" : "none" }}>
        <UserFields />
        <Box mt={2}>
          <Controller
            name="birthDate"
            control={control}
            rules={{
              required: "Data de nascimento é obrigatória",
              validate: (v) =>
                !v ||
                /^\d{4}-\d{2}-\d{2}$/.test(v) ||
                "Use o formato AAAA-MM-DD",
            }}
            render={({ field }) => (
              <TextField
                label="Data de Nascimento"
                type="date"
                fullWidth
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
                value={field.value ?? ""}
                onChange={(e) => {
                  const raw = e.target.value || "";
                  const [y = "", m = "", d = ""] = raw.split("-");
                  const y4 = y.replace(/\D/g, "").slice(0, 4);
                  const m2 = m.replace(/\D/g, "").slice(0, 2);
                  const d2 = d.replace(/\D/g, "").slice(0, 2);
                  const next = [y4, m2, d2].filter(Boolean).join("-");
                  field.onChange(next);
                }}
                inputProps={{
                  max: new Date().toISOString().slice(0, 10),
                  min: "1900-01-01",
                }}
                error={!!(errors as any).birthDate}
                helperText={(errors as any).birthDate?.message}
              />
            )}
          />
        </Box>
        <Box
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <TextField
            label="Peso (kg)"
            type="number"
            inputProps={{ min: 0, step: 0.01, inputMode: "decimal" }}
            margin="normal"
            required
            fullWidth
            error={!!errors.weight}
            onKeyDown={(e) => {
              const invalidChars = ["e", "E", "+", "-", "."];
              if (invalidChars.includes(e.key)) {
                e.preventDefault();
              }
            }}
            helperText={errors.weight?.message}
            {...register("weight", {
              setValueAs: (v) => {
                const s = String(v ?? "")
                  .replace(",", ".")
                  .trim();
                if (s === "") return undefined;
                const n = Number(s);
                return Number.isNaN(n) ? undefined : n;
              },
            })}
          />
          <TextField
            label="Altura (cm)"
            type="number"
            inputProps={{ min: 0, step: 0.1, inputMode: "decimal" }}
            margin="normal"
            required
            fullWidth
            error={!!errors.height}
            helperText={errors.height?.message}
            onKeyDown={(e) => {
              const invalidChars = ["e", "E", "+", "-", "."];
              if (invalidChars.includes(e.key)) {
                e.preventDefault();
              }
            }}
            {...register("height", {
              setValueAs: (v) => {
                const s = String(v ?? "")
                  .replace(",", ".")
                  .trim();
                if (s === "") return undefined;
                const n = Number(s);
                return Number.isNaN(n) ? undefined : n;
              },
            })}
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            width: "100%",
            justifyContent: "flex-end",
            display: "flex",
          }}
        >
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleNextStep}>
            Próximo
          </Button>
        </Box>
      </Box>

      {/*Address Content */}
      <Box sx={{ display: step === 1 ? "block" : "none" }}>
        <Box
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexDirection: "row",
          }}
        >
          <Controller
            name="socioEconomicLevel"
            control={control}
            render={({ field }) => (
              <TextField
                label="Nível Socioeconômico"
                select
                fullWidth
                margin="normal"
                error={!!errors.socioEconomicLevel}
                helperText={errors.socioEconomicLevel?.message}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              >
                {Object.values(SocioEconomicLevel).map((level) => (
                  <MenuItem key={level} value={level}>
                    {socioLabel(level)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="scholarShip"
            control={control}
            render={({ field }) => (
              <TextField
                label="Escolaridade"
                select
                fullWidth
                margin="normal"
                required
                error={!!errors.scholarShip}
                helperText={errors.scholarShip?.message}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
              >
                {Object.entries(ScholarShip).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        {/* Endereço */}
        <Box
          mt={2}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 120px" },
            gap: 2,
          }}
        >
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
                    field.onChange(digits); // form guarda só os dígitos
                    if (errors.zipCode) clearErrors("zipCode");
                  }}
                  onBlur={() => handleCepLookup(field.value ?? "")} // usa os dígitos
                  error={!!errors.zipCode}
                  helperText={errors.zipCode?.message}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 9, // 00000-000
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

          <Controller
            name="state"
            control={control}
            rules={{ required: "UF é obrigatória" }}
            render={({ field }) => (
              <TextField
                select
                label="UF"
                margin="normal"
                required
                fullWidth
                error={!!errors.state}
                helperText={errors.state?.message}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                InputLabelProps={{ shrink: true }}
                {...register("state")}
              >
                {UF_LIST.map((uf) => (
                  <MenuItem key={uf} value={uf}>
                    {uf}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box
          mt={2}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Cidade"
            margin="normal"
            required
            fullWidth
            error={!!errors.city}
            helperText={errors.city?.message}
            InputLabelProps={{ shrink: true }}
            {...register("city")}
          />
          <TextField
            label="Bairro"
            margin="normal"
            required
            fullWidth
            error={!!errors.neighborhood}
            helperText={errors.neighborhood?.message}
            InputLabelProps={{ shrink: true }}
            {...register("neighborhood")}
          />
        </Box>

        <Box
          mt={2}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "2fr", sm: "2fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Rua"
            margin="normal"
            required
            fullWidth
            error={!!errors.street}
            helperText={errors.street?.message}
            InputLabelProps={{ shrink: true }}
            {...register("street")}
          />
          <TextField
            label="Número"
            margin="normal"
            required
            fullWidth
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            error={!!errors.number}
            helperText={errors.number?.message}
            {...register("number")}
          />
        </Box>

        <Box mt={2}>
          <TextField
            label="Complemento"
            margin="normal"
            fullWidth
            error={!!errors.complement}
            helperText={errors.complement?.message}
            {...register("complement")}
          />
        </Box>

        <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            sx={{ mt: 2, mb: 2 }}
            onClick={() => setStep(0)}
          >
            Voltar
          </Button>
          <Button variant="contained" sx={{ mt: 2, mb: 2 }} type="submit">
            {isEdit ? "Salvar alterações" : "Cadastrar"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
