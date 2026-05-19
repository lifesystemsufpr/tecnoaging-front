"use client";

import * as React from "react";
import {
  Autocomplete,
  Input,
  Label,
  type InputProps,
} from "@/core/components/ui";
import { useDebouncedValue } from "@/core/hooks/useDebouncedValue";
import { Institution } from "../types";
import { useListInstitutions } from "../hooks/useListInstutions";
import type { UseAutocompleteProps } from "@/core/components/ui/autocomplete/useAutocomplete";

interface InstitutionAutocompleteProps extends Omit<
  UseAutocompleteProps<Institution>,
  "options" | "loading"
> {
  label?: string;
  placeholder?: string;
  size?: InputProps["size"];
  inputClassName?: string;
  inputErrorMessage?: string;
  className?: string;
  menuClassName?: string;
  optionClassName?: string;
  renderOption?: (
    option: Institution,
    state: { active: boolean }
  ) => React.ReactNode;
  pageSize?: number;
  searchDebounceMs?: number;
  active?: boolean;
  orderBy?: "title" | "createdAt";
  sortOrder?: "asc" | "desc";
  enabled?: boolean;
  valueId?: string;
}

export function InstitutionAutocomplete({
  label,
  placeholder = "Busque por instituicao",
  size = "md",
  inputClassName,
  inputErrorMessage,
  className,
  menuClassName,
  optionClassName,
  renderOption,
  pageSize = 50,
  searchDebounceMs = 400,
  active,
  orderBy,
  sortOrder,
  enabled = true,
  valueId,
  getOptionLabel,
  isOptionEqualToValue,
  inputValue,
  onInputChange,
  disabled,
  ...hookProps
}: InstitutionAutocompleteProps) {
  const inputId = React.useId();
  const [internalInputValue, setInternalInputValue] = React.useState("");

  const resolvedInputValue = inputValue ?? internalInputValue;
  const handleInputChange = React.useCallback(
    (value: string) => {
      onInputChange?.(value);
      if (inputValue === undefined) setInternalInputValue(value);
    },
    [onInputChange, inputValue]
  );

  const debouncedSearch = useDebouncedValue(
    resolvedInputValue,
    searchDebounceMs
  );
  const search = debouncedSearch?.trim() || undefined;

  const query = useListInstitutions({
    page: 1,
    pageSize,
    search,
    active,
    orderBy,
    sortOrder,
    enabled: enabled && !disabled,
  });

  const options = React.useMemo(() => query.data?.data ?? [], [query.data]);

  const resolveLabel =
    getOptionLabel ?? ((option: Institution) => option.title ?? "");
  const resolveEquality =
    isOptionEqualToValue ??
    ((a: Institution, b: Institution) => a?.id === b?.id);

  const resolvedValue = React.useMemo(() => {
    if (hookProps.value !== undefined) return hookProps.value ?? null;
    if (!valueId) return null;
    return options.find((option) => option.id === valueId) ?? null;
  }, [hookProps.value, valueId, options]);

  React.useEffect(() => {
    if (inputValue !== undefined) return;
    if (!resolvedValue) return;
    setInternalInputValue(resolveLabel(resolvedValue));
  }, [inputValue, resolvedValue, resolveLabel]);

  return (
    <div>
      {label && (
        <Label htmlFor={inputId} className="mb-1 block">
          {label}
        </Label>
      )}
      <Autocomplete
        {...hookProps}
        options={options}
        loading={query.isLoading || query.isFetching}
        value={resolvedValue}
        inputValue={resolvedInputValue}
        onInputChange={handleInputChange}
        getOptionLabel={resolveLabel}
        isOptionEqualToValue={resolveEquality}
        disabled={disabled}
        renderOption={renderOption}
        className={className}
        menuClassName={menuClassName}
        optionClassName={optionClassName}
        renderInput={(props) => (
          <Input
            {...props}
            id={inputId}
            size={size}
            placeholder={placeholder}
            className={inputClassName}
            errorMessage={inputErrorMessage}
          />
        )}
      />
    </div>
  );
}
