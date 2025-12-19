import UserFields from "@/components/common/UserFields";
import { HealthProFormData } from "@/lib/validators/user";
import { Box, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function HealthProfessionalForm() {
  const {
    register,
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
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
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
