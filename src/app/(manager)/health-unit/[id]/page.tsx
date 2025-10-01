"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { fetchHealthUnitById } from "@/services/api-health-unit";
import { HealthUnit } from "@/types/domain/Health-unit";
import { Copyable } from "@/components/Compyable";
import { UserDetailHeader } from "@/components/common/UserDetailHeader";

interface HealthUnitWithMeta extends HealthUnit {
  updatedAt?: string;
  active?: boolean;
}

const formatZip = (zip?: string | null) => {
  if (!zip) return "—";
  const digits = String(zip).replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return zip;
};

export default function HealthUnitDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [data, setData] = useState<HealthUnitWithMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const strId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const load = useCallback(async () => {
    const token = session?.accessToken;
    if (!strId || !token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchHealthUnitById(String(strId), token);
      setData(res as HealthUnitWithMeta);
    } catch (error: any) {
      setErr(error?.message || "Erro ao carregar unidade de saude.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [strId, session?.accessToken]);

  useEffect(() => {
    if (strId && session?.accessToken) {
      load();
    }
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
        Voce precisa estar logado para acessar esta pagina.
      </Typography>
    );
  }

  const name = data?.name ?? "—";
  const identifier = data?.id ?? String(strId ?? "—");
  const zip = formatZip(data?.zipCode);
  const addressLine1 =
    [data?.street, data?.number].filter((part) => !!part).join(", ") || "—";
  const complement = data?.complement || "—";
  const neighborhood = data?.neighborhood || "—";
  const cityState =
    [data?.city, data?.state].filter((part) => !!part).join(" - ") || "—";
  const updatedAt = data?.updatedAt;
  const active = data?.active ?? true;

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
            onClick={() => router.push("/health-unit")}
            underline="hover"
            color="inherit"
          >
            Unidades de Saude
          </MUILink>
          <Typography color="text.primary">
            {name !== "—" ? name : "Detalhes"}
          </Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/health-unit")}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() =>
              router.push(
                `/health-unit/${encodeURIComponent(String(strId))}/edit`
              )
            }
            disabled
          >
            Editar
          </Button>
        </Stack>
      </Stack>

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
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid size={12} key={index}>
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
            name={name}
            entity="Unidade de Saude"
            active={active}
            updatedAt={updatedAt}
          />

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Nome da unidade
              </Typography>
              <Typography variant="body1">{name}</Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Identificador
              </Typography>
              <Copyable text={identifier} label={identifier} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Endereco
              </Typography>
              <Typography variant="body1">{addressLine1}</Typography>
              <Typography variant="body2" color="text.secondary">
                Complemento: {complement}
              </Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Bairro
              </Typography>
              <Typography variant="body1">{neighborhood}</Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Cidade / Estado
              </Typography>
              <Typography variant="body1">{cityState}</Typography>
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
        <Typography>Nenhuma unidade encontrada.</Typography>
      )}
    </Box>
  );
}
