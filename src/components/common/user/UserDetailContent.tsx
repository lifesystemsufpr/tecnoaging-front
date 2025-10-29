import { User } from "@/types/domain/Person";
import { formatCpf, formatPhoneBR, genderPt } from "@/utils/format";
import { Grid, Typography } from "@mui/material";

export function UserDetailContent(userData: User) {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="subtitle2" color="text.secondary">
          Nome
        </Typography>
        <Typography variant="body1">{userData.fullName}</Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="subtitle2" color="text.secondary">
          CPF
        </Typography>
        <Typography variant="body1">{formatCpf(userData.cpf)}</Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="subtitle2" color="text.secondary">
          Telefone
        </Typography>
        <Typography variant="body1">
          {formatPhoneBR(userData.phone) || "N/A"}
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="subtitle2" color="text.secondary">
          Gênero
        </Typography>
        <Typography variant="body1">{genderPt(userData.gender)}</Typography>
      </Grid>
    </Grid>
  );
}
