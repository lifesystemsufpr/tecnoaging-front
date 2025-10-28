import { HealthProfessional } from "@/types/domain/Health-professional";
import { Grid, Typography } from "@mui/material";

export function HealthProfessionalDetailContent(user: HealthProfessional) {
  return (
    <Grid size={12} sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        Especialidade
      </Typography>
      <Typography variant="body1">{user.speciality}</Typography>
    </Grid>
  );
}
