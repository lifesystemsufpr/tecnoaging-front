import { HealthProfessional } from "@/core/types";
import { useDebouncedValue } from "@/core/hooks/useDebouncedValue";
import { Autocomplete, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import useFetchProfessionals from "../hooks/useFetchProfessionals";

interface ProfessionalAutocompleteProps {
  value: HealthProfessional | null;
  onChange: (professional: HealthProfessional | null) => void;
}

export default function ProfessionalAutocomplete({
  value,
  onChange,
}: ProfessionalAutocompleteProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchProfessionals({
      pageSize: 15,
      search: debouncedSearch,
    });

  const professionals = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, value) => setSearch(value)}
      options={professionals}
      loading={isLoading || isFetchingNextPage}
      getOptionLabel={(option) => option.fullName}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      noOptionsText="Nenhum profissional encontrado"
      loadingText="Buscando profissionais..."
      renderInput={(params) => <TextField {...params} label="Profissional" />}
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
    />
  );
}
