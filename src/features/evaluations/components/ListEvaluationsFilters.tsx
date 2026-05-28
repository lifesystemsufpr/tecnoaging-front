"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Input,
  Label,
  Select,
} from "@/core/components/ui";
import { useDebouncedValue } from "@/core/hooks/useDebouncedValue";
import { participantService } from "@/features/participants/services/participant.service";
import { professionalService } from "@/features/professionals/services/professional.service";
import {
  AutocompleteOption,
  useListEvaluationsContext,
} from "../contexts/ListEvaluationsContext";

export function ListEvaluationsFilters() {
  const { filters, setFilters, applyFilters, resetFilters } =
    useListEvaluationsContext();

  const patientId = useId();
  const professionalId = useId();
  const typeId = useId();
  const dateFromId = useId();
  const dateToId = useId();

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
    resetFilters();
  };

  const handleSearch = () => {
    applyFilters();
  };

  return (
    <Grid container spacing={16} align="center">
      <Grid item xs={12} md={6}>
        <Label htmlFor={patientId} className="mb-1 block">
          Participante
        </Label>
        <Autocomplete
          options={patientOptionsWithSelection}
          value={filters.patient}
          inputValue={filters.patientQuery}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              patient: value,
              patientQuery: value?.name ?? "",
            }))
          }
          onInputChange={(value) =>
            setFilters((prev) => {
              const currentName = prev.patient?.name ?? "";
              const shouldClear = currentName && value !== currentName;
              return {
                ...prev,
                patientQuery: value,
                patient: value ? (shouldClear ? null : prev.patient) : null,
              };
            })
          }
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={searchingPatients}
          loadingText="Buscando..."
          noOptionsText="Nenhum participante encontrado"
          renderInput={(props) => (
            <Input {...props} id={patientId} placeholder="Nome" size="lg" />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Label htmlFor={professionalId} className="mb-1 block">
          Profissional
        </Label>
        <Autocomplete
          options={professionalOptionsWithSelection}
          value={filters.professional}
          inputValue={filters.professionalQuery}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              professional: value,
              professionalQuery: value?.name ?? "",
            }))
          }
          onInputChange={(value) =>
            setFilters((prev) => {
              const currentName = prev.professional?.name ?? "";
              const shouldClear = currentName && value !== currentName;
              return {
                ...prev,
                professionalQuery: value,
                professional: value
                  ? shouldClear
                    ? null
                    : prev.professional
                  : null,
              };
            })
          }
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={searchingProfessionals}
          loadingText="Buscando..."
          noOptionsText="Nenhum profissional encontrado"
          renderInput={(props) => (
            <Input
              {...props}
              id={professionalId}
              placeholder="Nome"
              size="lg"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Label htmlFor={typeId} className="mb-1 block">
          Tipo
        </Label>
        <Select
          id={typeId}
          value={filters.type}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, type: event.target.value }))
          }
          className="h-12 text-base"
        >
          <option value="Todos">Todos</option>
          <option value="TTSTS">30STS</option>
          <option value="TMSTS">2MST</option>
        </Select>
      </Grid>

      <Grid item xs={12} md={3}>
        <Label htmlFor={dateFromId} className="mb-1 block">
          Data de
        </Label>
        <Input
          id={dateFromId}
          type="date"
          size="lg"
          value={filters.dateFrom ?? ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              dateFrom: event.target.value || null,
            }))
          }
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Label htmlFor={dateToId} className="mb-1 block">
          Data até
        </Label>
        <Input
          id={dateToId}
          type="date"
          size="lg"
          value={filters.dateTo ?? ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              dateTo: event.target.value || null,
            }))
          }
        />
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" gap={8}>
          <Button size="lg" onClick={handleSearch}>
            Buscar
          </Button>
          <Button variant="outline" size="lg" onClick={handleReset}>
            Limpar
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
