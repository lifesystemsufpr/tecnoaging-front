import { Button, Grid, Input, Label, Box } from "@/core/components/ui";
import { useCallback, useId, useState } from "react";

export function ParticipantFilters({ onSearch }) {
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const dateFromId = useId();
  const dateToId = useId();

  const handleSearch = useCallback(() => {
    onSearch({ dateFrom, dateTo });
  }, [onSearch, dateFrom, dateTo]);

  const handleReset = useCallback(() => {
    setDateFrom(null);
    setDateTo(null);
    onSearch({ dateFrom: null, dateTo: null });
  }, [onSearch]);

  return (
    <Grid container spacing={8} mb={16}>
      <Grid item xs={12} md={6}>
        <Label htmlFor={dateFromId} className="mb-1 block">
          Data de
        </Label>
        <Input
          id={dateFromId}
          type="date"
          size="md"
          value={dateFrom ?? ""}
          onChange={(event) => setDateFrom(event.target.value || null)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Label htmlFor={dateToId} className="mb-1 block">
          Data até
        </Label>
        <Input
          id={dateToId}
          type="date"
          size="md"
          value={dateTo ?? ""}
          onChange={(event) => setDateTo(event.target.value || null)}
        />
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" gap={8}>
          <Button size="sm" onClick={handleSearch}>
            Buscar
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Limpar
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
