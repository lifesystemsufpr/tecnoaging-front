import { InfoField } from "@/core/components/shared";
import { Researcher } from "@/core/types";
import { Grid } from "@/core/components/ui";

export interface DetailResearcherCardProps {
  data: Researcher;
}

export function DetailResearcherCard({ data }: DetailResearcherCardProps) {
  const { fieldOfStudy, institutionName, email } = data;

  return (
    <Grid container spacing={24} mt={24}>
      <InfoField label="Email" value={email} copyable />
      <InfoField label="Instituição" value={institutionName} />
      <InfoField label="Campo de estudo" value={fieldOfStudy} />
    </Grid>
  );
}
