"use client";

import { fetchResearcherById } from "@/services/api-researcher";
import { Researcher } from "@/types/domain/Reseracher";
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
import { formatCpf, formatPhoneBR, genderPt } from "@/utils/format";
import { Copyable } from "@/components/Compyable";
import { UserDetailHeader } from "@/components/common/UserDetailHeader";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [data, setData] = useState<Researcher | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const strId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const load = useCallback(async () => {
    if (!strId || !session?.accessToken) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchResearcherById({
        id: strId,
        access_token: session.accessToken,
      });
      setData(res as Researcher);
      setName(res.fullName || "");
    } catch (e: any) {
      setErr(e?.message || "Erro ao carregar pesquisador.");
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
            onClick={() => router.push("/users/researchers")}
            underline="hover"
            color="inherit"
          >
            Pesquisadores
          </MUILink>
          <Typography color="text.primary">
            {name !== "" ? name : "Detalhes"}
          </Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/users/researchers")}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() =>
              router.push(
                `/users/researchers/${encodeURIComponent(String(strId))}/edit`
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
              <Grid size={12} key={i}>
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
          {/* Header */}
          <UserDetailHeader
            active={!!data?.active || false}
            name={data.fullName || "—"}
            entity="Pesquisador"
            updatedAt={data?.updatedAt}
          />

          <Divider sx={{ my: 3 }} />

          {/* Detalhes */}
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Copyable text={data.email} label={data.email} />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                CPF
              </Typography>
              <Copyable
                text={data.cpf ?? undefined}
                label={formatCpf(data?.cpf)}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Telefone
              </Typography>
              <Typography variant="body1">
                {formatPhoneBR(data.phone || undefined)}
              </Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Gênero
              </Typography>
              <Typography variant="body1">{genderPt(data.gender)}</Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Área de atuação
              </Typography>
              <Typography variant="body1">{data.fieldOfStudy}</Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Instituição
              </Typography>

              <Typography variant="body1">{data.institutionName}</Typography>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Typography>Nenhum pesquisador encontrado.</Typography>
      )}
    </Box>
  );
}
