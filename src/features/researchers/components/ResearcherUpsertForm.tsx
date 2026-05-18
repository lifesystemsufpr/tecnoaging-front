"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { Input, Label, Button, Autocomplete } from "@/core/components/ui";
import UserFields from "@/core/components/shared/UserFields";
import {
  researcherCreateSchema,
  researcherUpdateSchema,
  type ResearcherFormData,
} from "@/lib/validators/user";
import type { Researcher } from "@/types/domain/Reseracher";
import type { Institution } from "@/types/domain/Institution";
import {
  mapResearcherCreate,
  mapResearcherUpdate,
  mapEntityToFormDefaults,
} from "@/lib/mappers/userMappers";
import { createResearcher, updateResearcher } from "@/services/api-researcher";
import { makeTitleService } from "@/services/makeTitleService";
import { SystemRoles } from "@/types/enums/system-roles";
import type { UserFormData, UserUpdateFormData } from "@/lib/validators/user";

interface ResearcherUpsertFormProps {
  editUser?: Researcher | null;
  onSuccess?: () => void;
}

type FormValues = ResearcherFormData;

export function ResearcherUpsertForm({
  editUser,
  onSuccess,
}: ResearcherUpsertFormProps) {
  const isEdit = !!editUser;
  const { data: session } = useSession();
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const schema = isEdit ? researcherUpdateSchema : researcherCreateSchema;

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? (mapEntityToFormDefaults({
          ...editUser,
          role: SystemRoles.RESEARCHER,
        } as never) as unknown as FormValues)
      : {
          role: SystemRoles.RESEARCHER,
          fullName: "",
          cpf: "",
          password: "",
          phone: "",
          gender: "MALE",
          email: "",
          institution: "",
          fieldOfStudy: "",
        },
    mode: "onBlur",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = methods;

  // Fetch institutions
  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const service = makeTitleService("institution");
        const data = await service.list(session?.accessToken);
        setInstitutions(data);
      } catch (error) {
        console.error("Erro ao buscar instituições:", error);
        setInstitutions([]);
      }
    }
    fetchInstitutions();
  }, [session?.accessToken]);

  const institutionValue = watch("institution");
  const selectedInstitution =
    institutions.find((i) => i.id === institutionValue) ?? null;

  const onSubmit = async (raw: FormValues) => {
    try {
      if (!session?.accessToken) throw new Error("Sem token de acesso");

      if (isEdit && editUser) {
        const payload = mapResearcherUpdate(
          raw as unknown as UserUpdateFormData
        );
        await updateResearcher({
          id: editUser.id,
          data: payload,
          access_token: session.accessToken,
        });
        toast.success("Pesquisador atualizado!");
      } else {
        const payload = mapResearcherCreate(raw as unknown as UserFormData);
        await createResearcher({
          data: payload,
          access_token: session.accessToken,
        });
        toast.success("Pesquisador criado!");
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
            {isEdit ? "Editar Pesquisador" : "Cadastrar Pesquisador"}
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {isEdit
              ? "Altere as informações e salve."
              : "Preencha o formulário abaixo para cadastrar um novo pesquisador."}
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

        {/* Instituição + Campo de Estudo */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="institution">Instituição *</Label>
            <Autocomplete
              options={institutions}
              getOptionLabel={(o) => o.title}
              value={selectedInstitution}
              onChange={(v) => setValue("institution", v?.id ?? "", { shouldValidate: true })}
              isOptionEqualToValue={(o, v) => o.id === v?.id}
              renderInput={(inputProps) => (
                <Input
                  {...inputProps}
                  id="institution"
                  placeholder="Buscar instituição..."
                  errorMessage={errors.institution?.message}
                />
              )}
            />
          </div>

          <div className="flex-1">
            <Label htmlFor="fieldOfStudy">Campo de Estudo</Label>
            <Controller
              name={"fieldOfStudy" as keyof FormValues}
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  id="fieldOfStudy"
                  placeholder="Ex: Ciências da Saúde"
                  value={(field.value as string) || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>
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
