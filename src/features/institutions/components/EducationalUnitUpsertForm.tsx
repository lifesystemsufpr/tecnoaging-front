"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { educationalUnitSchema } from "../validators/educational.validator";
import { EducationUnit, EducationUnitRequest } from "../types";
import { useCreateEducationalUnit } from "../hooks/educational-unit/useCreateEducationalUnit";
import { useUpdateEducationalUnit } from "../hooks/educational-unit/useUpdateEducationalUnit";
import {
  Box,
  Button,
  Grid,
  Input,
  Label,
  Typography,
} from "@/core/components/ui";
import { extractFieldErrors, ValidationApiError } from "@/core/api";

interface EducationalUnitUpsertFormProps {
  editEducationalUnit?: EducationUnit | null;
  onSuccess?: () => void;
}

export function EducationalUnitUpsertForm({
  editEducationalUnit,
  onSuccess,
}: EducationalUnitUpsertFormProps) {
  const createMutation = useCreateEducationalUnit();
  const updateMutation = useUpdateEducationalUnit();

  const isEdit = Boolean(editEducationalUnit);
  const initialFormData: EducationUnitRequest = useMemo(
    () => ({
      title: editEducationalUnit?.title ?? "",
    }),
    [editEducationalUnit]
  );

  const [formData, setFormData] =
    useState<EducationUnitRequest>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = useCallback((path: string) => {
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  const handleValidate = useCallback(() => {
    const result = educationalUnitSchema.safeParse(formData);
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

    if (isEdit && editEducationalUnit) {
      updateMutation.mutate(
        { id: editEducationalUnit.id ?? "", data: formData },
        {
          onSuccess: () => {
            toast.success("Unidade de ensino atualizada com sucesso!");
            onSuccess?.();
          },
          onError: (error) => {
            const apiError = error as ValidationApiError;
            toast.error(
              apiError.message || "Erro ao atualizar unidade de ensino"
            );
            if (apiError.data?.details?.fields) {
              setErrors(extractFieldErrors(apiError.data));
            }
          },
        }
      );
      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Unidade de ensino criada com sucesso!");
        onSuccess?.();
      },
      onError: (error) => {
        const apiError = error as ValidationApiError;
        toast.error(apiError.message || "Erro ao criar unidade de ensino");
        if (apiError.data?.details?.fields) {
          setErrors(extractFieldErrors(apiError.data));
        }
      },
    });
  }, [
    editEducationalUnit,
    formData,
    handleValidate,
    isEdit,
    createMutation,
    updateMutation,
    onSuccess,
  ]);

  return (
    <Box display="flex" direction="column" gap={20}>
      <Box display="flex" direction="column" gap={8} mb={18}>
        <Typography variant="h4" color="secondary">
          {isEdit ? "Editar Unidade de Ensino" : "Cadastrar Unidade de Ensino"}
        </Typography>
        <Typography variant="small">
          {isEdit
            ? "Faça as alterações desejadas e clique em salvar."
            : "Preencha os campos abaixo para cadastrar uma nova unidade."}
        </Typography>
      </Box>

      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Label htmlFor="title">Nome do Ensino</Label>
          <Input
            id="title"
            placeholder="Nome do Ensino"
            value={formData.title}
            errorMessage={errors["title"]}
            onChange={(e) => {
              clearError("title");
              setFormData({
                ...formData,
                title: e.target.value,
              });
            }}
            type="text"
            size="lg"
            required
          />
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
