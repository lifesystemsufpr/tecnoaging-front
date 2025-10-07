"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { fetchPatients } from "@/services/api-patient";
import { fetchHealthProfessionals } from "@/services/api-health-professional";
import { Evaluation } from "@/types/domain/Evaluation";
import { formatDateTime, toISODateEnd, toISODateStart } from "@/utils/dates";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type Option = { id: string; name: string };

type RequestFilters = {
  patientName: string | null;
  healthProfessionalName: string | null;
  startDate: string | null;
  endDate: string | null;
  type: string | null;
};

type TableRow = Evaluation & {
  patientName?: string;
  professionalName?: string;
  healthUnitName?: string;
};

const DEFAULT_FILTERS: RequestFilters = {
  patientName: null,
  healthProfessionalName: null,
  startDate: null,
  endDate: null,
  type: null,
};

type FiltersSectionProps = {
  token: string;
  onSearch: (filters: RequestFilters) => void;
  onReset: () => void;
  disabled?: boolean;
};

function FiltersSection({
  token,
  onSearch,
  onReset,
  disabled,
}: FiltersSectionProps) {
  const [patient, setPatient] = useState<Option | null>(null);
  const [professional, setProfessional] = useState<Option | null>(null);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [type, setType] = useState("");

  const [patientQuery, setPatientQuery] = useState("");
  const [professionalQuery, setProfessionalQuery] = useState("");
  const debouncedPatientQuery = useDebouncedValue(patientQuery, 300);
  const debouncedProfessionalQuery = useDebouncedValue(professionalQuery, 300);
  const [patientOptions, setPatientOptions] = useState<Option[]>([]);
  const [professionalOptions, setProfessionalOptions] = useState<Option[]>([]);
  const [searchingPatients, setSearchingPatients] = useState(false);
  const [searchingProfessionals, setSearchingProfessionals] = useState(false);

  const patientOptionsWithSelection = useMemo(() => {
    const seen = new Set<string>();
    const list = patient ? [patient, ...patientOptions] : [...patientOptions];
    return list.filter((opt) => {
      const key = `${opt.id}__${opt.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [patient, patientOptions]);

  const professionalOptionsWithSelection = useMemo(() => {
    const seen = new Set<string>();
    const list = professional
      ? [professional, ...professionalOptions]
      : [...professionalOptions];
    return list.filter((opt) => {
      const key = `${opt.id}__${opt.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [professional, professionalOptions]);

  const handleSearch = useCallback(() => {
    onSearch({
      patientName: patient?.name?.trim() || patientQuery.trim() || null,
      healthProfessionalName:
        professional?.name?.trim() || professionalQuery.trim() || null,
      startDate: dateFrom ? toISODateStart(dateFrom) : null,
      endDate: dateTo ? toISODateEnd(dateTo) : null,
      type: type.trim() ? type.trim() : null,
    });
  }, [
    onSearch,
    patient,
    patientQuery,
    professional,
    professionalQuery,
    dateFrom,
    dateTo,
    type,
  ]);

  const handleReset = useCallback(() => {
    setPatient(null);
    setPatientQuery("");
    setProfessional(null);
    setProfessionalQuery("");
    setDateFrom(null);
    setDateTo(null);
    setType("");
    setPatientOptions([]);
    setProfessionalOptions([]);
    onReset();
  }, [onReset]);

  useEffect(() => {
    const query = debouncedPatientQuery.trim();
    if (query.length < 2) {
      setPatientOptions([]);
      return;
    }

    let active = true;
    setSearchingPatients(true);

    fetchPatients(token, 1, 5, query)
      .then((response) => {
        if (!active) return;
        setPatientOptions(
          response.data.map((patientItem) => ({
            id: patientItem.id,
            name: patientItem.fullName,
          }))
        );
      })
      .catch((error) => {
        if (!active) return;
        console.error(error);
        toast.error("Erro ao buscar pacientes.");
      })
      .finally(() => {
        if (active) setSearchingPatients(false);
      });

    return () => {
      active = false;
    };
  }, [token, debouncedPatientQuery]);

  useEffect(() => {
    const query = debouncedProfessionalQuery.trim();
    if (query.length < 2) {
      setProfessionalOptions([]);
      return;
    }

    let active = true;
    setSearchingProfessionals(true);

    fetchHealthProfessionals({
      accessToken: token,
      page: 1,
      pageSize: 5,
      query,
    })
      .then((response) => {
        if (!active) return;
        setProfessionalOptions(
          response.data.map((prof) => ({
            id: prof.id ?? prof.cpf,
            name: prof.fullName,
          }))
        );
      })
      .catch((error) => {
        if (!active) return;
        console.error(error);
        toast.error("Erro ao buscar profissionais.");
      })
      .finally(() => {
        if (active) setSearchingProfessionals(false);
      });

    return () => {
      active = false;
    };
  }, [token, debouncedProfessionalQuery]);

  return (
    <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
      <Grid size={6}>
        <Autocomplete
          fullWidth
          size="small"
          value={patient}
          inputValue={patientQuery}
          onChange={(_event, value) => {
            if (typeof value === "string") {
              const trimmed = value.trim();
              const option = trimmed ? { id: trimmed, name: trimmed } : null;
              setPatient(option);
              setPatientQuery(option?.name ?? "");
            } else {
              setPatient(value);
              setPatientQuery(value?.name ?? "");
            }
          }}
          onInputChange={(_event, value) => setPatientQuery(value)}
          options={patientOptionsWithSelection}
          filterOptions={(optionsList) => optionsList}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          isOptionEqualToValue={(option, value) =>
            typeof value !== "string" && !!value && option.id === value.id
          }
          renderInput={(params) => (
            <TextField {...params} label="Paciente" placeholder="Nome" />
          )}
          clearOnBlur={false}
          freeSolo
          loading={searchingPatients}
          loadingText="Buscando..."
          noOptionsText="Nenhum paciente encontrado"
        />
      </Grid>
      <Grid size={6}>
        <Autocomplete
          fullWidth
          size="small"
          value={professional}
          inputValue={professionalQuery}
          onChange={(_event, value) => {
            if (typeof value === "string") {
              const trimmed = value.trim();
              const option = trimmed ? { id: trimmed, name: trimmed } : null;
              setProfessional(option);
              setProfessionalQuery(option?.name ?? "");
            } else {
              setProfessional(value);
              setProfessionalQuery(value?.name ?? "");
            }
          }}
          onInputChange={(_event, value) => setProfessionalQuery(value)}
          options={professionalOptionsWithSelection}
          filterOptions={(optionsList) => optionsList}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          isOptionEqualToValue={(option, value) =>
            typeof value !== "string" && !!value && option.id === value.id
          }
          renderInput={(params) => (
            <TextField {...params} label="Profissional" placeholder="Nome" />
          )}
          clearOnBlur={false}
          freeSolo
          loading={searchingProfessionals}
          loadingText="Buscando..."
          noOptionsText="Nenhum profissional encontrado"
        />
      </Grid>
      <Grid size={6}>
        <TextField
          size="small"
          label="Data de"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateFrom ?? ""}
          onChange={(event) => setDateFrom(event.target.value || null)}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          size="small"
          label="Data ate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateTo ?? ""}
          onChange={(event) => setDateTo(event.target.value || null)}
          fullWidth
        />
      </Grid>

      <Grid size={12} sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={handleSearch} disabled={disabled}>
          Buscar
        </Button>
        <Button variant="outlined" onClick={handleReset} disabled={disabled}>
          Limpar
        </Button>
      </Grid>
    </Grid>
  );
}

export default function TestsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;

  const filtersRef = useRef<RequestFilters>({ ...DEFAULT_FILTERS });
  const requestIdRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TableRow[]>([]);

  const columns = useMemo<ColumnConfig<TableRow>[]>(
    () => [
      { key: "type", header: "Tipo", width: 110 },
      { key: "patientName", header: "Paciente", flex: 1.2 },
      { key: "professionalName", header: "Profissional", flex: 1.2 },
      { key: "healthUnitName", header: "Unidade", width: 220, flex: 1.1 },
      {
        key: "time_init",
        header: "Inicio",
        render: (params) => formatDateTime(params.value as string),
      },
    ],
    []
  );

  const loadEvaluations = useCallback(
    async (filters?: RequestFilters) => {
      if (!token) return;

      const normalizedFilters: RequestFilters = {
        ...DEFAULT_FILTERS,
        ...(filters ?? filtersRef.current),
      };
      filtersRef.current = { ...normalizedFilters };

      const currentRequestId = ++requestIdRef.current;
      setLoading(true);

      try {
        const { data } = await fetchEvaluations(token, {
          patientName: normalizedFilters.patientName,
          healthProfessionalName: normalizedFilters.healthProfessionalName,
          startDate: normalizedFilters.startDate,
          endDate: normalizedFilters.endDate,
          type: normalizedFilters.type,
          page: 1,
          pageSize: 100,
        });

        if (currentRequestId !== requestIdRef.current) return;

        setRows(
          data.map((ev) => ({
            ...ev,
            patientName: ev.patient?.fullName,
            professionalName: ev.healthProfessional?.fullName,
            healthUnitName: ev.healthcareUnit?.name,
          }))
        );
      } catch (error) {
        if (currentRequestId === requestIdRef.current) {
          console.error(error);
          toast.error("Erro ao carregar testes.");
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [token]
  );

  const handleApplyFilters = useCallback(
    (filters: RequestFilters) => {
      void loadEvaluations(filters);
    },
    [loadEvaluations]
  );

  const handleResetFilters = useCallback(() => {
    void loadEvaluations(DEFAULT_FILTERS);
  }, [loadEvaluations]);

  useEffect(() => {
    if (!token) return;
    void loadEvaluations(DEFAULT_FILTERS);
  }, [token, loadEvaluations]);

  if (status === "loading") return <div>Carregando...</div>;
  if (!token)
    return <div>Voce precisa estar logado para acessar essa pagina.</div>;

  return (
    <Box sx={{ p: 2 }}>
      <h1>Avaliações</h1>
      <FiltersSection
        token={token}
        onSearch={handleApplyFilters}
        onReset={handleResetFilters}
        disabled={loading}
      />
      <GenericTable<TableRow>
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        showActions
        onView={(row) => router.push(`/5tsts/${row.id}`)}
        onDelete={async (row) => {
          try {
            await deleteEvaluation(row.id, token!);
            toast.success("Avaliacao excluida com sucesso!");
            await loadEvaluations();
          } catch {
            toast.error("Erro ao excluir avaliacao.");
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
        pageSize={20}
        autoHeight
      />
    </Box>
  );
}
