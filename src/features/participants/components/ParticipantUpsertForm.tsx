"use client";

import { useCallback, useState } from "react";
import { useUpdateParticipant } from "../hooks/useUpdateParticipant";
import { useCreateParticipant } from "../hooks/useCreateParticipant";
import { Gender, ScholarShip, SocioEconomicLevel, UF_LIST } from "@/core/enums";
import { Participant } from "@/core/types";
import { ParticipantNestedFormData } from "@/core/libs/validators";
import {
  Box,
  Button,
  Grid,
  Input,
  Label,
  Select,
  Typography,
} from "@/core/components/ui";
import {
  participantNestedCreateSchema,
  participantNestedUpdateSchema,
  participantStep1Schema,
} from "@/core/libs/validators/index";
import { formatCPF, sanatizeCPF, socioLabel } from "@/core/utils";
import { toast } from "sonner";
import { fetchEnderecoViaCEP } from "@/core/utils/api";

interface ParticipantUpsertFormProps {
  editUser?: Participant | null;
  onSuccess?: () => void;
}

export function ParticipantUpsertForm({
  editUser,
  onSuccess,
}: ParticipantUpsertFormProps) {
  const updateMutation = useUpdateParticipant();
  const createMutation = useCreateParticipant();

  const isEdit = !!editUser;
  const [step, setStep] = useState(0);
  const [cepLoading, setCepLoading] = useState(false);

  const initialFormData: ParticipantNestedFormData = {
    birthday: editUser?.birthday ?? "",
    scholarship:
      (editUser?.scholarship as unknown as keyof typeof ScholarShip) ??
      ("NONE" as keyof typeof ScholarShip),
    socio_economic_level:
      editUser?.socio_economic_level ?? SocioEconomicLevel.A,
    weight: editUser?.weight ?? (undefined as unknown as number),
    height: editUser?.height ?? (undefined as unknown as number),
    zipCode: editUser?.zipCode ?? "",
    street: editUser?.street ?? "",
    number: editUser?.number ?? "",
    complement: editUser?.complement ?? "",
    neighborhood: editUser?.neighborhood ?? "",
    city: editUser?.city ?? "",
    state: editUser?.state ?? "",
    user: {
      fullName: editUser?.fullName ?? "",
      cpf: editUser?.cpf ? formatCPF(editUser.cpf) : "",
      phone: editUser?.phone ?? "",
      gender: (editUser?.gender as Gender) ?? Gender.MALE,
      password: undefined,
      active: editUser?.active ?? true,
    },
  };

  const [formData, setFormData] =
    useState<ParticipantNestedFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = useCallback((path: string) => {
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  // --- ViaCEP lookup ---
  const handleCepLookup = useCallback(
    async (raw: string) => {
      const cep = (raw || "").replace(/\D/g, "");
      if (cep.length !== 8) {
        setErrors((prev) => ({
          ...prev,
          zipCode: "CEP deve ter 8 dígitos",
        }));
        return;
      }
      setCepLoading(true);
      try {
        const res = await fetchEnderecoViaCEP(cep);
        if (res?.erro) {
          setErrors((prev) => ({
            ...prev,
            zipCode: "CEP não encontrado",
          }));
          setFormData((prev) => ({
            ...prev,
            state: "",
            city: "",
            neighborhood: "",
            street: "",
          }));
          return;
        }
        clearError("zipCode");
        setFormData((prev) => ({
          ...prev,
          state: res.uf || "",
          city: res.localidade || "",
          neighborhood: res.bairro || "",
          street: res.logradouro || "",
        }));
      } catch {
        setErrors((prev) => ({
          ...prev,
          zipCode: "Erro ao consultar CEP",
        }));
      } finally {
        setCepLoading(false);
      }
    },
    [clearError]
  );

  // --- Step 1 Validation ---
  const handleNextStep = useCallback(() => {
    const step1Data = {
      birthday: formData.birthday,
      weight: formData.weight,
      height: formData.height,
      user: formData.user,
    };
    const result = participantStep1Schema.safeParse(step1Data);
    if (result.success) {
      setErrors({});
      setStep(1);
      return;
    }

    const nextErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = issue.path.join(".");
      if (!nextErrors[key]) nextErrors[key] = issue.message;
    });
    setErrors(nextErrors);
  }, [formData]);

  // --- Full validation + submit ---
  const handleValidate = useCallback(() => {
    const schema = isEdit
      ? participantNestedUpdateSchema
      : participantNestedCreateSchema;
    const result = schema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = issue.path.join(".");
      if (!nextErrors[key]) nextErrors[key] = issue.message;
    });
    setErrors(nextErrors);

    // If any step 1 field has errors, go back to step 0
    const step1Keys = [
      "user.fullName",
      "user.cpf",
      "user.phone",
      "user.gender",
      "birthDay",
      "weight",
      "height",
    ];
    const hasStep1Error = Object.keys(nextErrors).some((k) =>
      step1Keys.includes(k)
    );
    if (hasStep1Error) setStep(0);

    return false;
  }, [formData, isEdit]);

  // --- Format password from birthDay (DDMMYYYY) ---
  const formatBirthDayPassword = (birthDay: string): string => {
    if (!birthDay) return "";
    const date = new Date(birthDay);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = String(date.getFullYear());
    return `${dd}${mm}${yyyy}`;
  };

  const handleSubmit = useCallback(() => {
    const isValid = handleValidate();
    if (!isValid) return;

    const sanitizedCpf = sanatizeCPF(formData.user.cpf);
    const password = isEdit
      ? formData.user.password || undefined
      : formatBirthDayPassword(formData.birthday);

    const payload = {
      ...formData,
      user: {
        ...formData.user,
        cpf: sanitizedCpf,
        password,
      },
    };

    if (isEdit && editUser) {
      updateMutation.mutate(
        { id: editUser.id!, data: payload },
        {
          onSuccess: () => {
            toast.success("Participante atualizado com sucesso!");
            onSuccess?.();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Participante cadastrado com sucesso!");
          onSuccess?.();
        },
        onError: (error: any) => {
          const message = error?.message[0] || "Erro ao cadastrar participante";
          toast.error(message);
        },
      });
    }
  }, [
    formData,
    handleValidate,
    isEdit,
    editUser,
    updateMutation,
    createMutation,
    onSuccess,
  ]);

  // --- Helpers to update numeric fields ---
  const handleNumberChange = (field: "weight" | "height", raw: string) => {
    const sanitized = raw.replace(",", ".").trim();
    const num =
      sanitized === "" ? (undefined as unknown as number) : Number(sanitized);
    clearError(field);
    setFormData((prev) => ({ ...prev, [field]: num }));
  };

  return (
    <Box display="flex" direction="column" gap={20}>
      <Box display="flex" direction="column" gap={8} mb={18}>
        <Typography variant="h4" color="secondary">
          {isEdit ? "Editar Participante" : "Cadastrar Participante"}
        </Typography>
        <Typography variant="small">
          {isEdit
            ? "Faça as alterações desejadas e clique em salvar."
            : "Preencha os campos abaixo para cadastrar um novo participante."}
        </Typography>
      </Box>

      {/* ═══════ STEP 0 ═══════ */}
      {step === 0 && (
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              placeholder="Nome Completo"
              value={formData.user.fullName}
              errorMessage={errors["user.fullName"]}
              onChange={(e) => {
                clearError("user.fullName");
                setFormData({
                  ...formData,
                  user: { ...formData.user, fullName: e.target.value },
                });
              }}
              type="text"
              size="lg"
              required
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="CPF"
              type="text"
              size="lg"
              mask="cpf"
              value={formData.user.cpf}
              errorMessage={errors["user.cpf"]}
              onChange={(e) => {
                clearError("user.cpf");
                setFormData({
                  ...formData,
                  user: { ...formData.user, cpf: e.target.value },
                });
              }}
            />
          </Grid>

          <Grid item xs={6} lg={6}>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              placeholder="A senha será a data de nascimento do participante"
              type="password"
              size="lg"
              disabled
              value=""
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="Telefone"
              type="text"
              size="lg"
              mask="phone"
              value={formData.user.phone}
              errorMessage={errors["user.phone"]}
              onChange={(e) => {
                clearError("user.phone");
                setFormData({
                  ...formData,
                  user: { ...formData.user, phone: e.target.value },
                });
              }}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="gender">Gênero</Label>
            <Select
              id="gender"
              className="h-12"
              value={formData.user.gender}
              onChange={(e) => {
                clearError("user.gender");
                setFormData({
                  ...formData,
                  user: { ...formData.user, gender: e.target.value as Gender },
                });
              }}
            >
              <option value={Gender.FEMALE}>Feminino</option>
              <option value={Gender.MALE}>Masculino</option>
            </Select>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Label htmlFor="birthDay">Data de Nascimento</Label>
            <Input
              id="birthDay"
              type="date"
              size="lg"
              value={formData.birthday}
              errorMessage={errors["birthday"]}
              onChange={(e) => {
                clearError("birthday");
                setFormData({
                  ...formData,
                  birthday: e.target.value,
                });
              }}
              required
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              placeholder="Ex: 70"
              type="number"
              size="lg"
              value={
                formData.weight !== undefined && !isNaN(formData.weight)
                  ? String(formData.weight)
                  : ""
              }
              errorMessage={errors["weight"]}
              onChange={(e) => handleNumberChange("weight", e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              placeholder="Ex: 170"
              type="number"
              size="lg"
              value={
                formData.height !== undefined && !isNaN(formData.height)
                  ? String(formData.height)
                  : ""
              }
              errorMessage={errors["height"]}
              onChange={(e) => handleNumberChange("height", e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              display="flex"
              direction="row"
              justify="flex-end"
              gap={12}
              mt={12}
            >
              <Button
                variant="default"
                color="primary"
                size="lg"
                onClick={handleNextStep}
              >
                Próximo
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* ═══════ STEP 1 ═══════ */}
      {step === 1 && (
        <Grid container spacing={24}>
          <Grid item xs={12} lg={6}>
            <Label htmlFor="scholarship">Escolaridade</Label>
            <Select
              id="scholarship"
              className="h-12"
              value={formData.scholarship}
              onChange={(e) => {
                clearError("scholarship");
                setFormData({
                  ...formData,
                  scholarship: e.target.value as keyof typeof ScholarShip,
                });
              }}
            >
              <option value="">Selecione...</option>
              {Object.entries(ScholarShip).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
            {errors["scholarship"] && (
              <Typography variant="small" color="accent">
                {errors["scholarship"]}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="socio_economic_level">Nível Socioeconômico</Label>
            <Select
              id="socio_economic_level"
              className="h-12"
              value={formData.socio_economic_level}
              onChange={(e) => {
                clearError("socio_economic_level");
                setFormData({
                  ...formData,
                  socio_economic_level: e.target.value as SocioEconomicLevel,
                });
              }}
            >
              <option value="">Selecione...</option>
              {Object.values(SocioEconomicLevel).map((level) => (
                <option key={level} value={level}>
                  {socioLabel(level)}
                </option>
              ))}
            </Select>
            {errors["socio_economic_level"] && (
              <Typography variant="small" color="accent">
                {errors["socio_economic_level"]}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              placeholder="00000-000"
              type="text"
              size="lg"
              mask="cep"
              value={formData.zipCode}
              errorMessage={errors["zipCode"]}
              onChange={(e) => {
                clearError("zipCode");
                setFormData({ ...formData, zipCode: e.target.value });
              }}
              onBlur={() => handleCepLookup(formData.zipCode)}
              required
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="state">UF</Label>
            <Select
              id="state"
              className="h-12"
              value={formData.state}
              onChange={(e) => {
                clearError("state");
                setFormData({ ...formData, state: e.target.value });
              }}
            >
              <option value="">Selecione...</option>
              {Object.values(UF_LIST).map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </Select>
            {errors["state"] && (
              <Typography variant="small" color="accent">
                {errors["state"]}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              placeholder="Cidade"
              type="text"
              size="lg"
              value={formData.city}
              errorMessage={errors["city"]}
              onChange={(e) => {
                clearError("city");
                setFormData({ ...formData, city: e.target.value });
              }}
              required
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              placeholder="Bairro"
              type="text"
              size="lg"
              value={formData.neighborhood}
              errorMessage={errors["neighborhood"]}
              onChange={(e) => {
                clearError("neighborhood");
                setFormData({ ...formData, neighborhood: e.target.value });
              }}
              required
            />
          </Grid>

          <Grid item xs={12} lg={8}>
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              placeholder="Logradouro"
              type="text"
              size="lg"
              value={formData.street}
              errorMessage={errors["street"]}
              onChange={(e) => {
                clearError("street");
                setFormData({ ...formData, street: e.target.value });
              }}
              required
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              placeholder="Nº"
              type="text"
              size="lg"
              value={formData.number}
              errorMessage={errors["number"]}
              onChange={(e) => {
                clearError("number");
                setFormData({ ...formData, number: e.target.value });
              }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              placeholder="Apto, Bloco, etc."
              type="text"
              size="lg"
              value={formData.complement ?? ""}
              errorMessage={errors["complement"]}
              onChange={(e) => {
                clearError("complement");
                setFormData({ ...formData, complement: e.target.value });
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              display="flex"
              direction="row"
              justify="space-between"
              gap={12}
              mt={12}
            >
              <Button variant="outline" size="lg" onClick={() => setStep(0)}>
                Voltar
              </Button>
              <Button
                variant="default"
                color="primary"
                size="lg"
                onClick={handleSubmit}
              >
                {isEdit ? "Salvar Alterações" : "Cadastrar Participante"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
