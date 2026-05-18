"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { Input, Label, Button } from "@/core/components/ui";
import { Institution } from "@/types/domain/Institution";
import {
  createInstitution,
  updateInstitution,
} from "@/services/api-study-institution";

const InstitutionSchema = z.object({
  title: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome não pode exceder 100 caracteres"),
});

type InstitutionFormData = z.infer<typeof InstitutionSchema>;

interface InstitutionFormProps {
  initialData: Institution | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function InstitutionForm({
  initialData,
  onSuccess,
  onClose,
}: InstitutionFormProps) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InstitutionFormData>({
    resolver: zodResolver(InstitutionSchema),
    defaultValues: initialData || {
      title: "",
    },
  });

  const onSubmit = async (data: InstitutionFormData) => {
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      if (initialData) {
        await updateInstitution({
          id: initialData.id,
          title: data.title,
        });
        toast.success("Instituição de Ensino atualizada com sucesso!");
      } else {
        await createInstitution({
          title: data.title,
        });
        toast.success("Instituição de Ensino criada com sucesso!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar instituição:", error);
      toast.error(
        `Erro ao ${initialData ? "atualizar" : "criar"} instituição.`
      );
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
          {initialData
            ? "Editar Instituição de Ensino"
            : "Cadastrar Instituição de Ensino"}
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {initialData
            ? "Altere as informações necessárias e salve as alterações."
            : "Preencha os dados abaixo para registrar uma nova instituição no sistema."}
        </p>
      </div>

      {/* Nome */}
      <div>
        <Label htmlFor="inst-title">Nome da Instituição *</Label>
        <Input
          id="inst-title"
          placeholder="Nome da instituição de ensino"
          errorMessage={errors.title?.message}
          disabled={isSubmitting}
          {...register("title")}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : initialData
              ? "Salvar Alterações"
              : "Criar Instituição"}
        </Button>
      </div>
    </form>
  );
}
