"use client";

import { fetchInstitutionById } from "@/services/api-study-instituation";
import { Institution } from "@/types/domain/Institution";
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
import { Copyable } from "@/components/Compyable";
import { UserDetailHeader } from "@/components/common/UserDetailHeader";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [data, setData] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const strId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const load = useCallback(async () => {
    if (!strId || !session?.accessToken) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchInstitutionById({
        id: strId,
        access_token: session.accessToken,
      });
      setData(res as Institution);
    } catch (e: any) {
      setErr(e?.message || "Erro ao carregar instituição.");
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

  // Normalização dos campos
  const title = data?.title ?? "—";
  const updatedAt = (data as any)?.updatedAt as string | undefined;
  const active = (data as any)?.active as boolean | undefined;
  const instId = data?.id ?? strId ?? "—";

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
            onClick={() => router.push("/studies/institutions")}
            underline="hover"
            color="inherit"
          >
            Instituições de Estudo
          </MUILink>
          <Typography color="text.primary">
            {title !== "—" ? title : "Detalhes"}
          </Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/studies/institutions")}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() =>
              router.push(
                `/studies/institutions/${encodeURIComponent(String(strId))}/edit`
              )
            }
            disabled={true}
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
            {Array.from({ length: 4 }).map((_, i) => (
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
            entity="Instituição"
            name={title}
            updatedAt={updatedAt}
          />

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                ID
              </Typography>
              <Copyable text={String(instId)} label={String(instId)} />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Título
              </Typography>
              <Copyable text={title} label={title} />
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Typography>Nenhuma instituição encontrada.</Typography>
      )}
    </Box>
  );
}
