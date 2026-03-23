import { Divider, Grid, Typography, Chip } from "@mui/material";
import { ManagerProfile } from "../types";
import { formatDateTime } from "@/core/utils/format";
import { InfoField } from "@/core/components/layout";

export interface DetailManagerCardProps {
  manager: ManagerProfile;
}

export function DetailManagerCard({ manager }: DetailManagerCardProps) {
  const { cpf, fullName, gender, phone, active, createdAt, updatedAt } =
    manager;

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Detalhes do Administrador
      </Typography>

      <Grid container spacing={2}>
        <InfoField label="Nome Completo" value={fullName} />

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Status
          </Typography>
          <Chip
            label={active ? "Ativo" : "Inativo"}
            color={active ? "success" : "default"}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Grid>

        <InfoField label="CPF" value={cpf} copyable />

        <InfoField label="Gênero" value={gender} />
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <InfoField label="Telefone" value={phone} />

        <InfoField
          label="Criado em"
          value={createdAt ? formatDateTime(createdAt) : null}
        />

        <InfoField
          label="Última atualização"
          value={updatedAt ? formatDateTime(updatedAt) : null}
        />
      </Grid>
    </>
  );
}
