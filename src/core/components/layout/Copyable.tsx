import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useCallback } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export function Copyable({
  text,
  label,
}: {
  text?: string | null;
  label: string;
}) {
  const value = text ?? "";
  const canCopy = Boolean(value);
  const handleCopy = useCallback(async () => {
    try {
      if (!canCopy) return;
      await navigator.clipboard?.writeText(value);
    } catch {}
  }, [canCopy, value]);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="body1">{label}</Typography>
      {canCopy && (
        <Tooltip title="Copiar">
          <IconButton size="small" onClick={handleCopy} aria-label="Copiar">
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
