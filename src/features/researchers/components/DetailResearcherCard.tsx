import { InfoField } from "@/core/components/layout";
import { Researcher } from "@/core/types";
import { Grid } from "@mui/material";

export interface DetailResearcherCardProps {
  data: Researcher;
}

export function DetailResearcherCard({ data }: DetailResearcherCardProps) {
  const { fieldOfStudy, institutionName, email } = data;

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <InfoField label="Campo de estudo" value={fieldOfStudy} />
      <InfoField label="Instituição" value={institutionName} />
      <InfoField label="Email" value={email} />
    </Grid>
  );
}
