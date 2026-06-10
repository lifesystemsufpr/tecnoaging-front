"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { healthUnitSchema } from "../validators/health.validator";
import { HealthUnit, HealthUnitRequest } from "../types";
import { useCreateHealthUnit } from "../hooks/health-unit/useCreateHealthUnit";
import { useUpdateHealthUnit } from "../hooks/health-unit/useUpdateHealthUnit";
import {
  Box,
  Button,
  Grid,
  Input,
  Label,
  Select,
  Typography,
} from "@/core/components/ui";
import { fetchEnderecoViaCEP } from "@/core/utils/api";
import { UF_LIST } from "@/core/enums";

interface HealthUnitUpsertFormProps {
  editHealthUnit?: HealthUnit | null;
  onSuccess?: () => void;
}

const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function HealthUnitUpsertForm({
  editHealthUnit,
  onSuccess,
}: HealthUnitUpsertFormProps) {
  const createMutation = useCreateHealthUnit();
  const updateMutation = useUpdateHealthUnit();

  const isEdit = Boolean(editHealthUnit);
  const initialFormData: HealthUnitRequest = useMemo(
    () => ({
      name: editHealthUnit?.name ?? "",
      zipCode: editHealthUnit?.zipCode ?? "",
      street: editHealthUnit?.street ?? "",
      number: editHealthUnit?.number ?? "",
      complement: editHealthUnit?.complement ?? "",
      city: editHealthUnit?.city ?? "",
      state: editHealthUnit?.state ?? "",
      neighborhood: editHealthUnit?.neighborhood ?? "",
    }),
    [editHealthUnit]
  );

  const [formData, setFormData] = useState<HealthUnitRequest>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCepLoading, setIsCepLoading] = useState(false);

  const clearError = useCallback((path: string) => {
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  const handleValidate = useCallback(() => {
    const result = healthUnitSchema.safeParse(formData);
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
    return false;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    const isValid = handleValidate();
    if (!isValid) return;

    const payload: HealthUnitRequest = {
      ...formData,
      zipCode: onlyDigits(formData.zipCode),
      number: onlyDigits(formData.number),
    };

    if (isEdit && editHealthUnit) {
      updateMutation.mutate(
        { id: editHealthUnit.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Unidade atualizada com sucesso!");
            onSuccess?.();
          },
        }
      );
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Unidade criada com sucesso!");
        onSuccess?.();
      },
    });
  }, [
    editHealthUnit,
    formData,
    handleValidate,
    isEdit,
    createMutation,
    updateMutation,
    onSuccess,
  ]);

  const handleCepLookup = useCallback(
    async (rawCep: string) => {
      const cep = onlyDigits(rawCep);
      if (cep.length !== 8) return;

      setIsCepLoading(true);
      try {
        const data = await fetchEnderecoViaCEP(cep);
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro ?? prev.street,
          neighborhood: data.bairro ?? prev.neighborhood,
          city: data.localidade ?? prev.city,
          state: (data.uf ?? prev.state).toUpperCase(),
          complement: data.complemento ?? prev.complement,
        }));
        clearError("zipCode");
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          zipCode: error instanceof Error ? error.message : "CEP inválido",
        }));
      } finally {
        setIsCepLoading(false);
      }
    },
    [clearError]
  );

  return (
    <Box display="flex" direction="column" gap={20}>
      <Box display="flex" direction="column" gap={8} mb={18}>
        <Typography variant="h4" color="secondary">
          {isEdit ? "Editar Unidade de Saúde" : "Cadastrar Unidade de Saúde"}
        </Typography>
        <Typography variant="small">
          {isEdit
            ? "Faça as alterações desejadas e clique em salvar."
            : "Preencha os campos abaixo para cadastrar uma nova unidade."}
        </Typography>
      </Box>

      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Label htmlFor="name">Nome da Unidade</Label>
          <Input
            id="name"
            placeholder="Nome da Unidade"
            value={formData.name}
            errorMessage={errors["name"]}
            onChange={(e) => {
              clearError("name");
              setFormData({
                ...formData,
                name: e.target.value,
              });
            }}
            type="text"
            size="lg"
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
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

        <Grid item xs={12} sm={8}>
          <Label htmlFor="street">Logradouro (Rua/Avenida)</Label>
          <Input
            id="street"
            placeholder="Logradouro"
            value={formData.street}
            errorMessage={errors["street"]}
            onChange={(e) => {
              clearError("street");
              setFormData({
                ...formData,
                street: e.target.value,
              });
            }}
            type="text"
            size="lg"
            required
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            placeholder="Número"
            value={formData.number}
            errorMessage={errors["number"]}
            onChange={(e) => {
              clearError("number");
              setFormData({
                ...formData,
                number: onlyDigits(e.target.value),
              });
            }}
            type="text"
            size="lg"
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Complemento"
            value={formData.complement}
            errorMessage={errors["complement"]}
            onChange={(e) => {
              clearError("complement");
              setFormData({
                ...formData,
                complement: e.target.value,
              });
            }}
            type="text"
            size="lg"
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            placeholder="Bairro"
            value={formData.neighborhood}
            errorMessage={errors["neighborhood"]}
            onChange={(e) => {
              clearError("neighborhood");
              setFormData({
                ...formData,
                neighborhood: e.target.value,
              });
            }}
            type="text"
            size="lg"
            required
          />
        </Grid>

        <Grid item xs={12} sm={9}>
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            placeholder="Cidade"
            value={formData.city}
            errorMessage={errors["city"]}
            onChange={(e) => {
              clearError("city");
              setFormData({
                ...formData,
                city: e.target.value,
              });
            }}
            type="text"
            size="lg"
            required
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Label htmlFor="state">UF</Label>
          <Select
            id="state"
            className="h-12"
            value={formData.state}
            onChange={(e) => {
              clearError("state");
              setFormData({
                ...formData,
                state: e.target.value,
              });
            }}
          >
            <option value="">Selecione</option>
            {Object.values(UF_LIST).map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </Select>
          {errors["state"] && (
            <Typography variant="caption" className="text-destructive">
              {errors["state"]}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Box display="flex" direction="row" justify="flex-end" gap={12} mt={12}>
        <Button
          variant="default"
          color="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "Salvando..."
            : isEdit
              ? "Salvar Alterações"
              : "Cadastrar Unidade"}
        </Button>
      </Box>
    </Box>
  );
}
