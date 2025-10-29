import { formatDateTime } from "@/utils/dates";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";

function initials(name?: string) {
  if (!name) return "P";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "P";
}

export function UserDetailHeader({
  name,
  entity = "Pesquisador",
  active,
  updatedAt,
}) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar sx={{ width: 56, height: 56 }}>{initials(name)}</Avatar>
      <Box flex={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h5" fontWeight={600}>
            {name}
          </Typography>
          <Chip size="small" label={entity} />
          <Chip
            size="small"
            color={active ? "success" : "default"}
            variant={active ? "filled" : "outlined"}
            label={active ? "Ativo" : "Inativo"}
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Atualizado em {formatDateTime(updatedAt)}
        </Typography>
      </Box>
    </Stack>
  );
}
