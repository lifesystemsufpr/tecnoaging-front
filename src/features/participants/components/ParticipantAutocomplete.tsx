"use client";

import { Autocomplete, TextField } from "@mui/material";
import { useFetchListParticipant } from "../hooks/useFetchListParticipant";
import { useMemo, useState } from "react";
import { Participant } from "@/core/types";
import { useDebouncedValue } from "@/core/hooks/useDebouncedValue";

interface ParticipantAutocompleteProps {
  value: Participant | null;
  onChange?: (participant: Participant | null) => void;
}

export function ParticipantAutocomplete({
  value,
  onChange,
}: ParticipantAutocompleteProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading, fetchNextPage, hasNextPage } =
    useFetchListParticipant({
      pageSize: 15,
      search: debouncedSearch,
    });

  const participants = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange?.(newValue)}
      onInputChange={(_, value) => setSearch(value)}
      options={participants}
      loading={isLoading}
      getOptionLabel={(option) => option.fullName}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      noOptionsText="Nenhum participante encontrado"
      loadingText="Buscando participantes..."
      ListboxProps={{
        onScroll: (e) => {
          const el = e.currentTarget;
          if (
            el.scrollTop + el.clientHeight >= el.scrollHeight - 10 &&
            hasNextPage
          ) {
            fetchNextPage();
          }
        },
      }}
      renderInput={(params) => <TextField {...params} label="Participante" />}
    />
  );
}
