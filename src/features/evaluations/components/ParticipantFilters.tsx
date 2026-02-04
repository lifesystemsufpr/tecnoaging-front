import { Button, Grid, TextField } from "@mui/material";
import { useCallback, useState } from "react";

export function ParticipantFilters({ onSearch }) {
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  const handleSearch = useCallback(() => {
    onSearch({ dateFrom, dateTo });
  }, [onSearch, dateFrom, dateTo]);

  const handleReset = useCallback(() => {
    setDateFrom(null);
    setDateTo(null);
    onSearch({ dateFrom: null, dateTo: null });
  }, [onSearch]);

  return (
    <Grid container spacing={2} marginBottom={2}>
      <Grid size={6}>
        <TextField
          size="small"
          label="Data de"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          value={dateFrom ?? ""}
          onChange={(event) => setDateFrom(event.target.value || null)}
          fullWidth
        />
      </Grid>
      <Grid size={6}>
        <TextField
          size="small"
          label="Data até"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          value={dateTo ?? ""}
          onChange={(event) => setDateTo(event.target.value || null)}
          fullWidth
        />
      </Grid>
      <Grid size={12} sx={{ textAlign: "left" }}>
        <Button variant="contained" onClick={handleSearch} sx={{ mr: 1 }}>
          Buscar
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Limpar
        </Button>
      </Grid>
    </Grid>
  );
}
