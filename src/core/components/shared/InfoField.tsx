import { Box, Grid, Typography } from "@/core/components/ui";
import { Copyable } from "./Copyable";

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
    <Grid item xs={12} sm={6} md={4}>
      <Box display="flex" direction="column" gap={4}>
        <Typography variant="small" className="text-muted-foreground">
          {label}
        </Typography>

        {copyable ? (
          <Copyable text={String(value)} label={String(displayValue)} />
        ) : (
          <Typography>{displayValue}</Typography>
        )}

        {subValue && (
          <Typography variant="small" className="text-muted-foreground">
            {subValue}
          </Typography>
        )}
      </Box>
    </Grid>
  );
}
