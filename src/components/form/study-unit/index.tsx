// components/InstitutionForm.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Institution } from "@/types/domain/Institution";
import {
  createInstitution,
  updateInstitution,
} from "@/services/api-study-institution";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { FormContainer } from "../container/FormProvider";

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
      // Defina valores padrão para outros campos
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
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <Box mb={3}>
        <Typography variant="h6">
          {initialData
            ? `Editar Instituição de Ensino`
            : `Cadastrar Instituição de Ensino`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {initialData
            ? "Altere as informações necessárias e salve as alterações."
            : "Preencha os dados abaixo para registrar uma nova instituição no sistema."}
        </Typography>
      </Box>

      <TextField
        label="Nome da Instituição"
        fullWidth
        {...register("title")}
        error={!!errors.title}
        helperText={errors.title?.message}
        disabled={isSubmitting}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Salvando..."
            : initialData
              ? "Salvar Alterações"
              : "Criar Instituição"}
        </Button>
      </Box>
    </FormContainer>
  );
}
