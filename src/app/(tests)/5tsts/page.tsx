"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  TextField,
} from "@mui/material";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  GenericTable,
  ColumnConfig,
} from "@/components/datatable/GenericTable";
import { deleteEvaluation, fetchEvaluations } from "@/services/api-evaluation";
import { Evaluation } from "@/types/domain/Evaluation";
import { Patient } from "@/types/domain/Patient";
import { HealthProfessional } from "@/types/domain/Health-professional";
import {
  formatDate,
  formatDateTime,
  toISODateEnd,
  toISODateStart,
} from "@/utils/dates";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { fetchPatients } from "@/services/api-patient";
import { fetchHealthProfessionals } from "@/services/api-health-professional";

type Option = { id: string; name: string };

export default function TestsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;

  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<
    (Evaluation & {
      patientName?: string;
      professionalName?: string;
    })[]
  >([]);

  // Filtros
  const [patient, setPatient] = useState<Option | null>(null);
  const [professional, setProfessional] = useState<Option | null>(null);
  const [dateFrom, setDateFrom] = useState<string | null>(null); // 'YYYY-MM-DD'
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [type, setType] = useState<string>("");

  // Autocomplete sources
  const [patientQuery, setPatientQuery] = useState("");
  const [professionalQuery, setProfessionalQuery] = useState("");
  const debouncedPatientQuery = useDebouncedValue(patientQuery, 300);
  const debouncedProfessionalQuery = useDebouncedValue(professionalQuery, 300);
  const [patientOptions, setPatientOptions] = useState<Option[]>([]);
  const [professionalOptions, setProfessionalOptions] = useState<Option[]>([]);

  // Mapeamentos para exibir nome em vez de id
  const patientNameById = useMemo(() => {
    const map = new Map<string, string>();
    patientOptions.forEach((p) => map.set(p.id, p.name));
    if (patient) map.set(patient.id, patient.name);
    return map;
  }, [patientOptions, patient]);

  const professionalNameById = useMemo(() => {
    const map = new Map<string, string>();
    professionalOptions.forEach((p) => map.set(p.id, p.name));
    if (professional) map.set(professional.id, professional.name);
    return map;
  }, [professionalOptions, professional]);

  const loadEvaluations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchEvaluations(token, {
        patientId: patient?.id ?? null,
        healthProfessionalId: professional?.id ?? null,
        dateFrom: dateFrom ? toISODateStart(dateFrom) : null,
        dateTo: dateTo ? toISODateEnd(dateTo) : null,
        type: type || null,
        page: 1,
        pageSize: 100,
      });
      const patientMap = new Map(patientOptions.map((p) => [p.id, p.name]));
      const professionalMap = new Map(
        professionalOptions.map((p) => [p.id, p.name])
      );

      const withNames = data.map((ev) => ({
        ...ev,
        patientName:
          ev.patient?.fullName ??
          patientMap.get(String(ev.patientId)) ??
          String(ev.patientId ?? "—"),
        professionalName:
          ev.healthProfessional?.fullName ??
          professionalMap.get(String(ev.healthProfessionalId)) ??
          String(ev.healthProfessionalId ?? "—"),
      }));
      setRows(withNames);
    } catch (e: any) {
      console.error(e);
      toast.error("Erro ao carregar testes.");
    } finally {
      setLoading(false);
    }
  }, [
    token,
    patient?.id,
    professional?.id,
    dateFrom,
    dateTo,
    type,
    patientOptions,
    professionalOptions,
  ]);

  // Carrega inicial
  useEffect(() => {
    if (token) loadEvaluations();
  }, [token, loadEvaluations]);

  // Carrega opções de paciente
  useEffect(() => {
    let active = true;
    (async () => {
      if (!token) return;
      try {
        const result = await fetchPatients(token);
        if ((result as any).error) {
          throw new Error(
            `${(result as any).message} (Status: ${(result as any).statusCode})`
          );
        }
        const items: Patient[] = result as Patient[];
        if (items && items instanceof Error) {
          throw new Error(items.message);
        }
        if (!active) return;
        setPatientOptions(items.map((p) => ({ id: p.id, name: p.fullName })));
      } catch (error) {
        toast.error("Erro ao carregar pacientes: " + error.message);
      }
    })();
    return () => {
      active = false;
    };
  }, [token, debouncedPatientQuery]);

  // Carrega opções de profissional
  useEffect(() => {
    let active = true;
    (async () => {
      if (!token) return;
      try {
        const items: HealthProfessional[] = await fetchHealthProfessionals({
          accessToken: token,
        });
        if (!active) return;
        setProfessionalOptions(
          items.map((hp) => ({ id: hp.id, name: hp.fullName }))
        );
      } catch {
        // silencioso
      }
    })();
    return () => {
      active = false;
    };
  }, [token, debouncedProfessionalQuery]);

  // Enquanto carrega sessão
  if (status === "loading") return <div>Carregando…</div>;
  if (!token)
    return <div>Você precisa estar logado para acessar essa página.</div>;

  const columns: ColumnConfig<
    Evaluation & { patientName?: string; professionalName?: string }
  >[] = [
    { key: "type", header: "Tipo", width: 110 },
    { key: "patientName", header: "Paciente", flex: 1.2 },
    { key: "professionalName", header: "Profissional", flex: 1.2 },
    { key: "healthcareUnitId", header: "Unidade", width: 220, flex: 1.1 },
    {
      key: "time_init",
      header: "Início",
      render: (params) => formatDateTime(params.value as string),
    },
  ];

  const clearFilters = () => {
    setPatient(null);
    setProfessional(null);
    setDateFrom(null);
    setDateTo(null);
    setType("");
    loadEvaluations();
  };

  return (
    <Box sx={{ p: 2 }}>
      <h1>Testes / Avaliações</h1>
      {/* Barra de filtros */}
      <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Grid size={6}>
          <Autocomplete
            fullWidth // Força o componente a tentar preencher o espaço
            size="small"
            value={patient}
            onChange={(_e, v) =>
              setPatient(typeof v === "string" ? { id: v, name: v } : v)
            }
            onInputChange={(_e, v) => setPatientQuery(v)}
            options={patientOptions}
            getOptionLabel={(o) => (typeof o === "string" ? o : o.name)}
            renderInput={(params) => (
              <TextField {...params} label="Paciente" placeholder="Nome" />
            )}
            clearOnBlur={false}
            freeSolo
          />
        </Grid>
        <Grid size={6}>
          <Autocomplete
            fullWidth // Força o componente a tentar preencher o espaço
            size="small"
            value={professional}
            onChange={(_e, v) =>
              setProfessional(typeof v === "string" ? { id: v, name: v } : v)
            }
            onInputChange={(_e, v) => setProfessionalQuery(v)}
            options={professionalOptions}
            getOptionLabel={(o) => (typeof o === "string" ? o : o.name)}
            renderInput={(params) => (
              <TextField {...params} label="Profissional" placeholder="Nome" />
            )}
            clearOnBlur={false}
            freeSolo
          />
        </Grid>
        <Grid size={6}>
          <TextField
            size="small"
            label="Data de"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateFrom ?? ""}
            onChange={(e) => setDateFrom(e.target.value || null)}
            fullWidth
          />
        </Grid>
        <Grid size={6}>
          <TextField
            size="small"
            label="Data até"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateTo ?? ""}
            onChange={(e) => setDateTo(e.target.value || null)}
            fullWidth
          />
        </Grid>

        <Grid size={12} sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={loadEvaluations}>
            Buscar
          </Button>
          <Button variant="outlined" onClick={clearFilters}>
            Limpar
          </Button>
        </Grid>
      </Grid>
      <GenericTable<Evaluation>
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        showActions
        onView={(row) => router.push(`/5tsts/${row.id}`)}
        onDelete={async (row) => {
          try {
            await deleteEvaluation(row.id, token!);
            toast.success("Avaliação excluída com sucesso!");
            await loadEvaluations();
          } catch {
            toast.error("Erro ao excluir avaliação.");
          }
        }}
        loading={loading}
        density="compact"
        rowHref={(row) => `/5tsts/${row.id}`}
        toolbar={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`Total: ${rows.length}`}
              size="small"
              variant="outlined"
            />
          </Box>
        }
        pageSize={10}
        autoHeight
      />
    </Box>
  );
}
