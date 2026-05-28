import { Copy } from "lucide-react";
import { useCallback } from "react";
import { Box, IconButton, Tooltip, Typography } from "@/core/components/ui";

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
    <Box display="flex" align="center" gap={8}>
      <Typography>{label}</Typography>
      {canCopy && (
        <Tooltip content="Copiar">
          <IconButton
            icon={Copy}
            size="sm"
            variant="ghost"
            color="neutral"
            onClick={handleCopy}
            ariaLabel="Copiar"
          />
        </Tooltip>
      )}
    </Box>
  );
}
