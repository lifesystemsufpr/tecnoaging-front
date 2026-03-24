import { formatCpf, formatPhoneBR, genderPt } from "@/core/utils/format";
import { Grid } from "@mui/material";
import { InfoField } from "@/core/components/layout";

interface UserDetailContentProps {
  userData: {
    fullName: string;
    cpf: string;
    phone?: string;
    gender: string;
  };
}

export function UserDetailContent({ userData }: UserDetailContentProps) {
  return (
    <Grid container spacing={2}>
      <InfoField label="Nome" value={userData.fullName} />

      <InfoField label="CPF" value={formatCpf(userData.cpf)} copyable />

      <InfoField
        label="Telefone"
        value={formatPhoneBR(userData.phone) || null}
        copyable
      />

      <InfoField label="Gênero" value={genderPt(userData.gender)} />
    </Grid>
  );
}
