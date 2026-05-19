"use client";

import { useState } from "react";
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

import { researcherCreateSchema } from "@/core/libs/validators/index";

interface ResearcherUpsertFormProps {
  editUser?: Researcher | null;
  onSuccess?: () => void;
}

const initialFormData: ResearcherCreateRequest = {
  email: "",
  fieldOfStudy: "",
  institutionId: "",
  user: {
    fullName: "",
    cpf: "",
    phone: "",
    gender: Gender.MALE,
    password: "",
    active: true,
  },
};

export function ResearcherUpsertForm({
  editUser,
  onSuccess,
}: ResearcherUpsertFormProps) {
  const isEdit = !!editUser;
  const updateMutation = useUpdateResearcher();

  const [formData, setFormData] =
    useState<ResearcherCreateRequest>(initialFormData);

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
            onChange={(e) =>
              setFormData({
                ...formData,
                user: { ...formData.user, fullName: e.target.value },
              })
            }
            type="text"
            size="lg"
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
            onChange={(e) =>
              setFormData({
                ...formData,
                user: { ...formData.user, cpf: e.target.value },
              })
            }
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
            onChange={(e) =>
              setFormData({
                ...formData,
                user: { ...formData.user, password: e.target.value },
              })
            }
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
            onChange={(e) =>
              setFormData({
                ...formData,
                user: { ...formData.user, phone: e.target.value },
              })
            }
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Label htmlFor="gender">Gênero</Label>
          <Select
            id="gender"
            className="h-12"
            value={formData.user.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                user: { ...formData.user, gender: e.target.value as Gender },
              })
            }
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
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Label htmlFor="institutionId">Instituição</Label>
          <InstitutionAutocomplete
            size="lg"
            placeholder="Instituição"
            onChange={(e) => setFormData({ ...formData, institutionId: e.id })}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Label htmlFor="fieldOfStudy">Campo de Estudo</Label>
          <Input
            id="fieldOfStudy"
            placeholder="Campo de Estudo"
            type="text"
            size="lg"
            value={formData.fieldOfStudy}
            onChange={(e) =>
              setFormData({
                ...formData,
                fieldOfStudy: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>

      <Box display="flex" direction="row" justify="flex-end" gap={12} mt={12}>
        <Button variant="default" color="primary" size="lg">
          Cadastrar
        </Button>
      </Box>
    </Box>
  );
}
