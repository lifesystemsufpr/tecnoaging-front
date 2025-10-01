"use client";

import { fetchHealthProfessionalById } from "@/services/api-health-professional";
import { HealthProfessional } from "@/types/domain/Health-professional";
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

type HP = HealthProfessional & {
  gender?: "MALE" | "FEMALE" | "OTHER";
};

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [data, setData] = useState<HealthProfessional | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const strId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const load = useCallback(async () => {
    if (!strId || !session?.accessToken) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchHealthProfessionalById({
        id: strId,
        accessToken: session.accessToken,
      });
      setData(res as HealthProfessional);
    } catch (e: any) {
      setErr(e?.message || "Erro ao carregar profissional.");
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

  const name = data?.fullName ?? "—";
  const email = data?.email ?? (data as any)?.user?.email ?? "—";
  const cpf = data?.cpf;
  const phone = data?.phone ?? null;
  const gender = data?.gender as HP["gender"];
  const speciality = data?.speciality ?? "—";
  const updatedAt = (data as any)?.updatedAt as string | undefined;
  const active = (data as any)?.active as boolean | undefined;

  return (
    <Box p={3} sx={{ mx: "auto" }}>
      {/* Breadcrumbs + ações */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <MUILink
            component="button"
            onClick={() => router.push("/users/health-professionals")}
            underline="hover"
            color="inherit"
          >
            Profissionais de Saúde
          </MUILink>
          <Typography color="text.primary">
            {name !== "—" ? name : "Detalhes"}
          </Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/users/health-professionals")}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() =>
              router.push(
                `/users/health-professionals/${encodeURIComponent(String(strId))}/edit`
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
            {Array.from({ length: 6 }).map((_, i) => (
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
          <UserDetailHeader
            active={!!active}
            name={name}
            updatedAt={updatedAt}
          />

          <Divider sx={{ my: 3 }} />

          {/* Detalhes */}
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Copyable text={email} label={email} />
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
                Especialidade
              </Typography>
              <Typography variant="body1">{speciality}</Typography>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Typography>Nenhum profissional encontrado.</Typography>
      )}
    </Box>
  );
}
