// ResearcherForm.tsx
"use client";

import UserFields from "@/components/common/UserFields";
import { Autocomplete, Box, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { Institution } from "@/types/domain/Institution";
import type { UserFormData, UserUpdateFormData } from "@/lib/validators/user";
import { useEffect, useState } from "react";
import { makeTitleService } from "@/services/makeTitleService";
import { useSession } from "next-auth/react";

const findById = (opts: Institution[], id?: string) =>
  opts.find((o) => o.id === id) ?? null;

export default function ResearcherForm({
  isEdit = false,
}: {
  isEdit?: boolean;
}) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchDatas() {
      try {
        const serviceInstituiton = makeTitleService("institution");

        const [institutions] = await Promise.all([
          serviceInstituiton.list(session?.accessToken),
        ]);

        setInstitutions(institutions);
      } catch (error) {
        console.log("Erro ao buscar dados:", error);
        setInstitutions([]);
      }
    }
    fetchDatas();
  }, [session?.accessToken]);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<UserFormData | UserUpdateFormData>();

  return (
    <Box>
      <UserFields isEdit={isEdit} />

      <Box mt={2}>
        <TextField
          label="Email"
          fullWidth
          required
          margin="normal"
          error={!!(errors as any).email}
          helperText={(errors as any).email?.message}
          {...register("email" as any)}
        />
      </Box>

      <Box
        mt={2}
        sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}
      >
        <Controller
          name={"institution" as any}
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              disablePortal
              openOnFocus
              options={institutions}
              getOptionLabel={(o) => o.title}
              value={findById(institutions, field.value)}
              onChange={(_, v) => field.onChange(v?.id ?? "")}
              isOptionEqualToValue={(o, v) => o.id === v?.id}
              slotProps={{
                popper: { sx: { zIndex: (t) => t.zIndex.modal + 1 } },
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Instituição"
                  margin="normal"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          )}
        />

        <Controller
          name={"fieldOfStudy" as any}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Campo de Estudo"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />

        <Controller
          name={"specialization" as any}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Especialização"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </Box>
    </Box>
  );
}
