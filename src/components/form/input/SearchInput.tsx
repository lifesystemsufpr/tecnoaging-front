import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

export const SearchInput = ({
  onSearch,
  placeholder = "Buscar",
}: {
  onSearch: (val: string) => void;
  placeholder?: string;
}) => {
  const [localValue, setLocalValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [localValue, onSearch]);

  return (
    <TextField
      label={placeholder}
      variant="outlined"
      size="small"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
};
