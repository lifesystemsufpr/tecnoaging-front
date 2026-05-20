import { Grid } from "@/core/components/ui";
import { InfoField } from "../InfoField";
import { formatCPF, formatPhoneBR, genderPt } from "@/core/utils";

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
    <Grid container spacing={24} mb={24}>
      <InfoField label="Nome" value={userData.fullName} />

      <InfoField label="CPF" value={formatCPF(userData.cpf)} copyable />

      <InfoField
        label="Telefone"
        value={formatPhoneBR(userData.phone) || null}
        copyable
      />

      <InfoField label="Gênero" value={genderPt(userData.gender)} />
    </Grid>
  );
}
