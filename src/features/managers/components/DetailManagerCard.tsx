import { ManagerProfile } from "../types";
import { InfoField } from "@/core/components/shared";
import { Grid, Separator } from "@/core/components/ui";
import { formatDateTime } from "@/core/utils";

export interface DetailManagerCardProps {
  manager: ManagerProfile;
}

export function DetailManagerCard({ manager }: DetailManagerCardProps) {
  const { createdAt, updatedAt } = manager;

  return (
    <>
      <Separator className="my-6" />

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
