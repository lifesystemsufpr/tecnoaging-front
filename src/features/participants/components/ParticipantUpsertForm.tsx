"use client";

import { useParticipantForm } from "../hooks/useParticipantForm";
import { Participant } from "@/core/types";
import { Box, Typography } from "@/core/components/ui";
import { ParticipantStepPersonalInfo } from "./form/ParticipantStepPersonalInfo";
import { ParticipantStepAddress } from "./form/ParticipantStepAddress";

interface ParticipantUpsertFormProps {
  editUser?: Participant | null;
  onSuccess?: () => void;
}

export function ParticipantUpsertForm({
  editUser,
  onSuccess,
}: ParticipantUpsertFormProps) {
  const form = useParticipantForm({ editUser, onSuccess });

  return (
    <Box display="flex" direction="column" gap={20}>
      <Box display="flex" direction="column" gap={8} mb={18}>
        <Typography variant="h4" color="secondary">
          {form.isEdit ? "Editar Participante" : "Cadastrar Participante"}
        </Typography>
        <Typography variant="small">
          {form.isEdit
            ? "Faça as alterações desejadas e clique em salvar."
            : "Preencha os campos abaixo para cadastrar um novo participante."}
        </Typography>
      </Box>

      {form.step === 0 && (
        <ParticipantStepPersonalInfo
          formData={form.formData}
          errors={form.errors}
          onChange={form.setField}
          onClearError={form.clearError}
          onNext={form.handleNextStep}
        />
      )}

      {form.step === 1 && (
        <ParticipantStepAddress
          formData={form.formData}
          errors={form.errors}
          cepLoading={form.cepLoading}
          onChange={form.setField}
          onClearError={form.clearError}
          onCepBlur={() => form.handleCepLookup(form.formData.zipCode)}
          onBack={() => form.setStep(0)}
          onSubmit={form.handleSubmit}
          isSubmitting={form.isSubmitting}
          isEdit={form.isEdit}
        />
      )}
    </Box>
  );
}
