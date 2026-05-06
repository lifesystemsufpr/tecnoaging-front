"use client";

import { useEffect, useMemo, useState } from "react";
import { Autocomplete, Button, Grid, MenuItem, TextField } from "@mui/material";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { participantService } from "@/features/participants/services/participant.service";
import { professionalService } from "@/features/professionals/services/professional.service";
import {
  AutocompleteOption,
  useListEvaluationsContext,
} from "../contexts/ListEvaluationsContext";

export function ListEvaluationsFilters() {
  const { filters, setFilters, setPage } = useListEvaluationsContext();

  // ─── Autocomplete state ───────────────────────────────────────────────
  const [patientOptions, setPatientOptions] = useState<AutocompleteOption[]>(
    []
  );
  const [professionalOptions, setProfessionalOptions] = useState<
    AutocompleteOption[]
  >([]);
  const [searchingPatients, setSearchingPatients] = useState(false);
  const [searchingProfessionals, setSearchingProfessionals] = useState(false);

  const debouncedPatientQuery = useDebouncedValue(filters.patientQuery, 300);
  const debouncedProfessionalQuery = useDebouncedValue(
    filters.professionalQuery,
    300
  );

  // ─── Merged options (keep selected value visible) ─────────────────────
  const patientOptionsWithSelection = useMemo(() => {
    const seen = new Set<string>();
    const list = filters.patient
      ? [filters.patient, ...patientOptions]
      : [...patientOptions];
    return list.filter((opt) => {
      const key = `${opt.id}__${opt.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [filters.patient, patientOptions]);

  const professionalOptionsWithSelection = useMemo(() => {
    const seen = new Set<string>();
    const list = filters.professional
      ? [filters.professional, ...professionalOptions]
      : [...professionalOptions];
    return list.filter((opt) => {
      const key = `${opt.id}__${opt.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [filters.professional, professionalOptions]);

  // ─── Fetch participants ───────────────────────────────────────────────
  useEffect(() => {
    const query = debouncedPatientQuery.trim();
    if (query.length < 2) {
      setPatientOptions([]);
      return;
    }

    let active = true;
    setSearchingPatients(true);

    participantService
      .fetchParticipants({ page: 1, pageSize: 5, search: query })
      .then((response) => {
        if (!active) return;
        setPatientOptions(
          response.data.map((p) => ({ id: p.id, name: p.fullName }))
        );
      })
      .catch(() => {
        if (active) setPatientOptions([]);
      })
      .finally(() => {
        if (active) setSearchingPatients(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedPatientQuery]);

  // ─── Fetch professionals ──────────────────────────────────────────────
  useEffect(() => {
    const query = debouncedProfessionalQuery.trim();
    if (query.length < 2) {
      setProfessionalOptions([]);
      return;
    }

    let active = true;
    setSearchingProfessionals(true);

    professionalService
      .fetchProfessionals({ page: 1, pageSize: 5, search: query })
      .then((response) => {
        if (!active) return;
        setProfessionalOptions(
          response.data.map((p) => ({
            id: p.id ?? p.cpf,
            name: p.fullName,
          }))
        );
      })
      .catch(() => {
        if (active) setProfessionalOptions([]);
      })
      .finally(() => {
        if (active) setSearchingProfessionals(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedProfessionalQuery]);

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleReset = () => {
    setPatientOptions([]);
    setProfessionalOptions([]);
    setPage(0);
    setFilters({
      patient: null,
      patientQuery: "",
      professional: null,
      professionalQuery: "",
      dateFrom: null,
      dateTo: null,
      type: "Todos",
    });
  };

  const handleSearch = () => {
    setPage(0);
  };

  return (
    <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
      <Grid size={6}>
        <Autocomplete
          fullWidth
          size="small"
          value={filters.patient}
          inputValue={filters.patientQuery}
          onChange={(_event, value) => {
            if (typeof value === "string") {
              const trimmed = value.trim();
              const option = trimmed ? { id: trimmed, name: trimmed } : null;
              setFilters((prev) => ({
                ...prev,
                patient: option,
                patientQuery: option?.name ?? "",
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                patient: value,
                patientQuery: value?.name ?? "",
              }));
            }
          }}
          onInputChange={(_event, value) =>
            setFilters((prev) => ({ ...prev, patientQuery: value }))
          }
          options={patientOptionsWithSelection}
          filterOptions={(optionsList) => optionsList}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          isOptionEqualToValue={(option, value) =>
            typeof value !== "string" && !!value && option.id === value.id
          }
          renderInput={(params) => (
            <TextField {...params} label="Participante" placeholder="Nome" />
          )}
          clearOnBlur={false}
          freeSolo
          loading={searchingPatients}
          loadingText="Buscando..."
          noOptionsText="Nenhum participante encontrado"
        />
      </Grid>

      <Grid size={6}>
        <Autocomplete
          fullWidth
          size="small"
          value={filters.professional}
          inputValue={filters.professionalQuery}
          onChange={(_event, value) => {
            if (typeof value === "string") {
              const trimmed = value.trim();
              const option = trimmed ? { id: trimmed, name: trimmed } : null;
              setFilters((prev) => ({
                ...prev,
                professional: option,
                professionalQuery: option?.name ?? "",
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                professional: value,
                professionalQuery: value?.name ?? "",
              }));
            }
          }}
          onInputChange={(_event, value) =>
            setFilters((prev) => ({ ...prev, professionalQuery: value }))
          }
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
          select
          size="small"
          label="Tipo"
          value={filters.type}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, type: event.target.value }))
          }
          fullWidth
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="TTSTS">30STS</MenuItem>
          <MenuItem value="TMSTS">2MST</MenuItem>
        </TextField>
      </Grid>

      <Grid size={3}>
        <TextField
          size="small"
          label="Data de"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.dateFrom ?? ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              dateFrom: event.target.value || null,
            }))
          }
          fullWidth
        />
      </Grid>

      <Grid size={3}>
        <TextField
          size="small"
          label="Data até"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.dateTo ?? ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              dateTo: event.target.value || null,
            }))
          }
          fullWidth
        />
      </Grid>

      <Grid size={12} sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={handleSearch}>
          Buscar
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Limpar
        </Button>
      </Grid>
    </Grid>
  );
}
