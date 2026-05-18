"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

import { Input, Label, Button } from "@/core/components/ui";
import UserFields from "@/core/components/shared/UserFields";
import {
  healthProCreateSchema,
  healthProUpdateSchema,
  type HealthProFormData,
} from "@/lib/validators/user";
import type { HealthProfessional } from "@/types/domain/Health-professional";
import {
  mapHealthProCreate,
  mapHealthProUpdate,
} from "@/lib/mappers/userMappers";
import {
  createHealthProfessional,
  updateHealthProfessional,
} from "@/services/api-health-professional";
import { SystemRoles } from "@/types/enums/system-roles";
import type { UserFormData, UserUpdateFormData } from "@/lib/validators/user";
import { mapEntityToFormDefaults } from "@/lib/mappers/userMappers";

interface ProfessionalUpsertFormProps {
  editUser?: HealthProfessional | null;
  onSuccess?: () => void;
}

type FormValues = HealthProFormData;

export function ProfessionalUpsertForm({
  editUser,
  onSuccess,
}: ProfessionalUpsertFormProps) {
  const isEdit = !!editUser;
  const { data: session } = useSession();

  const schema = isEdit ? healthProUpdateSchema : healthProCreateSchema;

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? (mapEntityToFormDefaults({
          ...editUser,
          role: SystemRoles.HEALTH_PROFESSIONAL,
        } as never) as unknown as FormValues)
      : {
          role: SystemRoles.HEALTH_PROFESSIONAL,
          fullName: "",
          cpf: "",
          password: "",
          phone: "",
          gender: "MALE",
          email: "",
          specialization: "",
        },
    mode: "onBlur",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (raw: FormValues) => {
    try {
      if (!session?.accessToken) throw new Error("Sem token de acesso");

      if (isEdit && editUser) {
        const payload = mapHealthProUpdate(raw as unknown as UserUpdateFormData);
        await updateHealthProfessional({
          id: editUser.id,
          data: payload,
          accessToken: session.accessToken,
        });
        toast.success("Profissional de Saúde atualizado!");
      } else {
        const payload = mapHealthProCreate(raw as unknown as UserFormData);
        await createHealthProfessional({
          accessToken: session.accessToken,
          data: payload,
        });
        toast.success("Profissional de Saúde criado!");
      }

      onSuccess?.();
    } catch (err) {
      const message = (err as Error)?.message || String(err);
      if (message.includes("Unexpected token 'T'")) {
        toast.error("Erro no servidor. Funcionalidade não implementada.");
      } else {
        toast.error(message);
      }
      console.error("Submission error:", err);
    }
  };

  const onError = () => {
    toast.error("Erros no formulário, verifique os campos.");
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
            {isEdit
              ? "Editar Profissional de Saúde"
              : "Cadastrar Profissional de Saúde"}
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {isEdit
              ? "Altere as informações e salve."
              : "Preencha o formulário abaixo para cadastrar um novo profissional."}
          </p>
        </div>

        {/* Campos compartilhados */}
        <UserFields isEdit={isEdit} />

        {/* Email */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                errorMessage={errors.email?.message}
              />
            )}
          />
        </div>

        {/* Especialização */}
        <div>
          <Label htmlFor="specialization">Especialização *</Label>
          <Controller
            name="specialization"
            control={control}
            render={({ field }) => (
              <Input
                id="specialization"
                placeholder="Ex: Fisioterapia, Geriatria..."
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                errorMessage={errors.specialization?.message}
              />
            )}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? "Salvar alterações" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
