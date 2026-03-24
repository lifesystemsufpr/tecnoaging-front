import { InfoField } from "@/core/components/layout";
import { HealthProfessional } from "@/core/types";
import { Grid } from "@mui/material";

export interface DetailProfessionalCardProps {
  data: HealthProfessional;
}

export function DetailProfessionalCard({ data }: DetailProfessionalCardProps) {
  const { speciality, email } = data;

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <InfoField label="Especialidade" value={speciality} />
      <InfoField label="Email" value={email} copyable />
    </Grid>
  );
}
