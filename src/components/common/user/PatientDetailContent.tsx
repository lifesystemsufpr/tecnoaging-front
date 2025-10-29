import { Copyable } from "@/components/Compyable";
import { Patient } from "@/types/domain/Patient";
import { ScholarShip } from "@/types/enums/scholar-ship";
import { SocioEconomicLevel } from "@/types/enums/socio-economic-level";
import { fmtNumber, formatDateBr } from "@/utils/format";
import { socioLabel } from "@/utils/socioEconomic";
import { Divider, Grid, Typography } from "@mui/material";

export function PatientDefailtContent(user: Patient) {
  const addressLine1 =
    [
      user?.street || "",
      user?.number ? `, ${user.number}` : "",
      user?.complement ? ` — ${user.complement}` : "",
    ]
      .join("")
      .trim() || "—";
  const addressLine2 =
    [user?.neighborhood, user?.city, user?.state].filter(Boolean).join(" • ") ||
    "—";

  return (
    <>
      <Grid size={12} sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Data de nascimento
        </Typography>
        <Typography variant="body1">{formatDateBr(user.birthday)}</Typography>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Grid container sx={{ mt: 2 }}>
        <Grid size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Peso
          </Typography>
          <Typography variant="body1">{fmtNumber(user.height)} kg</Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Altura
          </Typography>
          <Typography variant="body1">{fmtNumber(user.weight)} cm</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Escolaridade
          </Typography>
          <Typography variant="body1">
            {ScholarShip[user.scholarship]}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Nível socioeconômico
          </Typography>
          <Typography variant="body1">
            {user.socio_economic_level
              ? socioLabel(user.socio_economic_level as SocioEconomicLevel)
              : "—"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Endereço */}
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Endereço
          </Typography>
          <Typography variant="body1">{addressLine1}</Typography>
          <Typography variant="body2" color="text.secondary">
            {addressLine2}
          </Typography>
        </Grid>

        <Grid size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            CEP
          </Typography>
          <Copyable text={user?.zipCode} label={user?.zipCode} />
        </Grid>
      </Grid>
    </>
  );
}
