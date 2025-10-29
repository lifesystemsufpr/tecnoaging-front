import { Researcher } from "@/types/domain/Reseracher";
import { Grid, Typography } from "@mui/material";

export function ResearcherDetailContent(user: Researcher) {
  return (
    <>
      <Grid size={12} sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Campo de estudo
        </Typography>
        <Typography variant="body1">{user.fieldOfStudy}</Typography>
      </Grid>

      <Grid size={12} sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Instituição
        </Typography>

        <Typography variant="body1">{user.institutionName}</Typography>
      </Grid>
    </>
  );
}
