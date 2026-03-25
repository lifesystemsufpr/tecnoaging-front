import { Divider, Grid } from "@mui/material";
import { ManagerProfile } from "../types";
import { formatDateTime } from "@/core/utils/format";
import { InfoField } from "@/core/components/layout";

export interface DetailManagerCardProps {
  manager: ManagerProfile;
}

export function DetailManagerCard({ manager }: DetailManagerCardProps) {
  const { createdAt, updatedAt } = manager;

  return (
    <>
      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
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
