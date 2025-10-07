"use client";

import { Patient } from "@/types/domain/Patient";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Link as MUILink,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatCpf,
  formatDateBr,
  formatPhoneBR,
  genderPt,
} from "@/utils/format";
import { Copyable } from "@/components/Compyable";
import { UserDetailHeader } from "@/components/common/UserDetailHeader";
import { socioLabel } from "@/utils/socioEconomic";
import { SocioEconomicLevel } from "@/types/enums/socio-economic-level";
import { fetchPatientById } from "@/services/api-patient";
import { ScholarShip } from "@/types/enums/scholar-ship";

const fmtNumber = (n?: number, opts: Intl.NumberFormatOptions = {}) =>
  typeof n === "number"
    ? new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 2,
        ...opts,
      }).format(n)
    : "—";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [data, setData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const strId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const load = useCallback(async () => {
    if (!strId || !session?.accessToken) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchPatientById({
        id: String(strId),
        access_token: session.accessToken,
      });
      setData(res as Patient);
    } catch (e: any) {
      setErr(e?.message || "Erro ao carregar paciente.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [strId, session?.accessToken]);

  useEffect(() => {
    if (strId && session?.accessToken) load();
  }, [strId, session?.accessToken, load]);

  if (status === "loading") {
    return (
      <Box p={3}>
        <Skeleton variant="text" width={240} height={36} />
        <Skeleton
          variant="rectangular"
          height={180}
          sx={{ mt: 2, borderRadius: 1 }}
        />
      </Box>
    );
  }

  if (!session) {
    return (
      <Typography p={3}>
        Você precisa estar logado para acessar essa página.
      </Typography>
    );
  }

  // Normalização (Patient é flat, mas deixo com "fallbacks" seguros)
  const name = data?.fullName ?? "—";
  const cpf = data?.cpf;
  const phone = data?.phone ?? null;
  const gender = data?.gender;
  const birthday = data?.birthday;
  const scholarship = data?.scholarship;
  const socio = data?.socio_economic_level as SocioEconomicLevel | undefined;
  const updatedAt = data?.updatedAt;

  const heightCm = data?.height;
  const weightKg = data?.weight;
  const heightM = typeof heightCm === "number" ? heightCm / 100 : undefined;

  const addressLine1 =
    [
      data?.street || "",
      data?.number ? `, ${data.number}` : "",
      data?.complement ? ` — ${data.complement}` : "",
    ]
      .join("")
      .trim() || "—";
  const addressLine2 =
    [data?.neighborhood, data?.city, data?.state].filter(Boolean).join(" • ") ||
    "—";
  const zip = data?.zipCode
    ? data.zipCode.replace(/^(\d{5})(\d{3})$/, "$1-$2")
    : "—";

  return (
    <Box p={3} sx={{ mx: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <MUILink
            component="button"
            onClick={() => router.push("/users/patients")}
            underline="hover"
            color="inherit"
          >
            Pacientes
          </MUILink>
          <Typography color="text.primary">
            {name !== "—" ? name : "Detalhes"}
          </Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/users/patients")}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() =>
              router.push(
                `/users/patients/${encodeURIComponent(String(strId))}/edit`
              )
            }
            disabled={true}
          >
            Editar
          </Button>
        </Stack>
      </Stack>

      {/* Conteúdo */}
      {loading ? (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={56} height={56} />
            <Box flex={1}>
              <Skeleton variant="text" width={280} height={32} />
              <Skeleton variant="text" width={180} />
            </Box>
            <Skeleton variant="rectangular" width={120} height={32} />
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid key={i} size={12}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : err ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="error" gutterBottom>
            {err}
          </Typography>
          <Button onClick={load} variant="outlined">
            Tentar novamente
          </Button>
        </Paper>
      ) : data ? (
        <Paper sx={{ p: 3 }}>
          <UserDetailHeader
            active={true}
            name={name}
            updatedAt={updatedAt}
            entity="Paciente"
          />

          <Divider sx={{ my: 3 }} />

          {/* Identificação */}
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Nome completo
              </Typography>
              <Typography variant="body1">{name}</Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                CPF
              </Typography>
              <Copyable text={cpf ?? undefined} label={formatCpf(cpf)} />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Telefone
              </Typography>
              <Typography variant="body1">
                {formatPhoneBR(phone || undefined)}
              </Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Gênero
              </Typography>
              <Typography variant="body1">{genderPt(gender)}</Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Data de nascimento
              </Typography>
              <Typography variant="body1">{formatDateBr(birthday)}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Saúde */}
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Peso
              </Typography>
              <Typography variant="body1">{fmtNumber(weightKg)} kg</Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Altura
              </Typography>
              <Typography variant="body1">
                {typeof heightCm === "number"
                  ? `${fmtNumber(heightCm)} cm`
                  : "—"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Escolaridade e nível socioeconômico */}
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Escolaridade
              </Typography>
              <Typography variant="body1">
                {ScholarShip[scholarship]}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Nível socioeconômico
              </Typography>
              <Typography variant="body1">
                {socio ? socioLabel(socio as SocioEconomicLevel) : "—"}
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
              <Copyable text={data?.zipCode} label={zip} />
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Typography>Nenhum paciente encontrado.</Typography>
      )}
    </Box>
  );
}
