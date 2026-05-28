import { InfoField } from "@/core/components/shared";
import { HealthProfessional } from "@/core/types";
import { Grid } from "@/core/components/ui";

export interface DetailProfessionalCardProps {
  data: HealthProfessional;
}

export function DetailProfessionalCard({ data }: DetailProfessionalCardProps) {
  const { speciality, email } = data;

  return (
    <Grid container spacing={24} mt={24}>
      <InfoField label="Email" value={email} copyable />
      <InfoField label="Especialidade" value={speciality} />
    </Grid>
  );
}
