"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Stack, TextField, Button } from "@mui/material";

const schema = yup.object({
  title: yup.string().required("Nome é obrigatório"),
});

export type TitleFormValues = { title: string };

export default function TitleForm({
  initialTitle = "",
  onCancel,
  onSubmit,
  submitting = false,
  submitLabel = "Salvar",
}: {
  initialTitle?: string;
  onCancel?: () => void;
  onSubmit: (values: TitleFormValues) => Promise<void> | void;
  submitting?: boolean;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TitleFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { title: initialTitle },
  });

  useEffect(() => {
    reset({ title: initialTitle });
  }, [initialTitle, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField
          label="Nome"
          placeholder="Instituição / Área / Especialidade"
          size="small"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
          autoFocus
        />
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {onCancel && (
            <Button variant="outlined" onClick={onCancel} disabled={submitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
