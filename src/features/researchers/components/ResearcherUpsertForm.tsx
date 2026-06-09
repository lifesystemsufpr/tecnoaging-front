"use client";

import { useCallback, useState } from "react";
import { useUpdateResearcher } from "../hooks/useUpdateResearcher";
import { Gender } from "@/core/enums";
import { ResearcherCreateRequest } from "../types";
import { Researcher } from "@/core/types";
import { InstitutionAutocomplete } from "@/features/institutions";
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
  researcherCreateSchema,
  researcherUpdateSchema,
} from "@/core/libs/validators/index";
import { useCreateResearcher } from "../hooks/useCreateResearcher";
import { sanatizeCPF } from "@/core/utils";
import { toast } from "sonner";

interface ResearcherUpsertFormProps {
  editUser?: Researcher | null;
  onSuccess?: () => void;
}

export function ResearcherUpsertForm({
  editUser,
  onSuccess,
}: ResearcherUpsertFormProps) {
  const updateMutation = useUpdateResearcher();
  const createMutation = useCreateResearcher();

  const isEdit = !!editUser;
  const initialFormData: ResearcherCreateRequest = {
    email: editUser?.email ?? "",
    fieldOfStudy: editUser?.fieldOfStudy ?? "",
    institutionId: editUser?.institutionId ?? "",
    user: {
      fullName: editUser?.fullName ?? "",
      cpf: editUser?.cpf ?? "",
      phone: editUser?.phone ?? "",
      gender: Gender.MALE,
      password: "",
      active: true,
    },
  };

  const [formData, setFormData] =
    useState<ResearcherCreateRequest>(initialFormData);
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
    const schema = isEdit ? researcherUpdateSchema : researcherCreateSchema;
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
    return false;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    const isValid = handleValidate();
    if (!isValid) return;

    const sanitizedCpf = sanatizeCPF(formData.user.cpf);
    const payload = {
      ...formData,
      user: {
        ...formData.user,
        cpf: sanitizedCpf,
        password:
          formData.user.password !== "" ? formData.user.password : undefined,
      },
    };

    if (isEdit && editUser) {
      updateMutation.mutate(
        { id: editUser.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Pesquisador atualizado com sucesso!");
            onSuccess?.();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Pesquisador criado com sucesso!");
          onSuccess?.();
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

  return (
    <Box display="flex" direction="column" gap={20}>
      <Box display="flex" direction="column" gap={8} mb={18}>
        <Typography variant="h4" color="secondary">
          {isEdit ? "Editar Pesquisador" : "Cadastrar Pesquisador"}
        </Typography>
        <Typography variant="small">
          {isEdit
            ? "Faça as alterações desejadas e clique em salvar."
            : "Preencha os campos abaixo para cadastrar um novo pesquisador."}
        </Typography>
      </Box>

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
        <Grid item xs={12} lg={6}>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            placeholder="Senha"
            type="password"
            size="lg"
            value={formData.user.password}
            errorMessage={errors["user.password"]}
            onChange={(e) => {
              clearError("user.password");
              setFormData({
                ...formData,
                user: { ...formData.user, password: e.target.value },
              });
            }}
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
        <Grid item xs={12}>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            placeholder="E-mail"
            type="email"
            size="lg"
            value={formData.email}
            errorMessage={errors["email"]}
            onChange={(e) => {
              clearError("email");
              setFormData({
                ...formData,
                email: e.target.value,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Label htmlFor="institutionId">Instituição</Label>
          <InstitutionAutocomplete
            size="lg"
            placeholder="Instituição"
            valueId={formData.institutionId}
            inputErrorMessage={errors["institutionId"]}
            onChange={(value) => {
              clearError("institutionId");
              setFormData({
                ...formData,
                institutionId: value?.id ?? "",
              });
            }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Label htmlFor="fieldOfStudy">Campo de Estudo</Label>
          <Input
            id="fieldOfStudy"
            placeholder="Campo de Estudo"
            errorMessage={errors["fieldOfStudy"]}
            type="text"
            size="lg"
            value={formData.fieldOfStudy}
            onChange={(e) => {
              clearError("fieldOfStudy");
              setFormData({
                ...formData,
                fieldOfStudy: e.target.value,
              });
            }}
          />
        </Grid>
      </Grid>

      <Box display="flex" direction="row" justify="flex-end" gap={12} mt={12}>
        <Button
          variant="default"
          color="primary"
          size="lg"
          onClick={handleSubmit}
        >
          {isEdit ? "Salvar Alterações" : "Cadastrar Pesquisador"}
        </Button>
      </Box>
    </Box>
  );
}
