import { Grid, Typography, Stack } from "@mui/material";
import { Copyable } from "@/core/components/layout";

interface InfoFieldProps {
  label: string;
  value?: string | number | null;
  copyable?: boolean;
  subValue?: string;
}

export function InfoField({
  label,
  value,
  subValue,
  copyable,
}: InfoFieldProps) {
  const displayValue =
    value === null || value === undefined || value === "" ? "—" : value;

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>

        {copyable ? (
          <Copyable text={String(value)} label={String(displayValue)} />
        ) : (
          <Typography variant="body1" color="text.primary">
            {displayValue}
          </Typography>
        )}

        {subValue && (
          <Typography variant="body2" color="text.secondary">
            {subValue}
          </Typography>
        )}
      </Stack>
    </Grid>
  );
}
