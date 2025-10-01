import UserFields from "@/components/common/UserFields";
import {
  HealthProFormData,
  UserFormData,
  UserUpdateFormData,
} from "@/lib/validators/user";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface HealthProfessionalFormProps {
  isEdit: boolean;
}

export default function HealthProfessionalForm({
  isEdit,
}: HealthProfessionalFormProps) {
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >(null);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<HealthProFormData>();

  return (
    <Box>
      <UserFields />
      <Box mt={2}>
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          required
          error={!!(errors as any).email}
          helperText={(errors as any).email?.message}
          {...register("email" as any)}
        />
      </Box>
      <Box mt={2}>
        <TextField
          label="Especialização"
          {...register("specialization")}
          fullWidth
          margin="normal"
          required
          error={!!errors.specialization}
          helperText={errors.specialization?.message}
        />
      </Box>
    </Box>
  );
}
