import { Participant } from "@/core/types/User.types";

import {
  formatAddressLine1,
  formatAddressLine2,
  formatZipCode,
} from "../utils/format";
import { fmtNumber, formatData } from "@/core/utils/format";
import { ScholarShip } from "@/types/enums/scholar-ship";
import { SocioEconomicLevel } from "@/core/enums";
import { socioLabel } from "@/core/utils/label";
import { InfoField } from "@/core/components/shared";
import { Grid } from "@/core/components/ui";

export function DetailParticipantCard({ data }: { data: Participant }) {
  const address1 = formatAddressLine1(data);
  const address2 = formatAddressLine2(data);
  const zipFormatted = formatZipCode(data.zipCode);
  const heightFormatted =
    typeof data.height === "number" ? `${fmtNumber(data.height)} cm` : null;
  const weightFormatted = data.weight ? `${fmtNumber(data.weight)} kg` : null;

  return (
    <Grid container spacing={24} mt={2}>
      <InfoField label="Data de nascimento" value={formatData(data.birthday)} />
      <InfoField label="Peso" value={weightFormatted} />
      <InfoField label="Altura" value={heightFormatted} />
      <InfoField
        label="Escolaridade"
        value={data.scholarship ? ScholarShip[data.scholarship] : null}
      />
      <InfoField
        label="Nível socioeconômico"
        value={
          data.socio_economic_level
            ? socioLabel(data.socio_economic_level as SocioEconomicLevel)
            : null
        }
      />
      <InfoField label="Endereço" value={address1} subValue={address2} />
      <InfoField label="CEP" value={zipFormatted} copyable />
    </Grid>
  );
}
