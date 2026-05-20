import { formatDateTime } from "@/core/utils/format";
import { Avatar, Badge, Box, Typography } from "@/core/components/ui";

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
  const statusLabel = active ? "Ativo" : "Inativo";
  const statusVariant = active ? "success" : "secondary";

  return (
    <Box display="flex" align="center" gap={16}>
      <Avatar name={name} size="lg" />
      <Box w="100%">
        <Box display="flex" align="center" gap={8} wrap="wrap">
          <Typography as="h2" variant="h4">
            {name}
          </Typography>
          <Badge variant="secondary">{entity}</Badge>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </Box>
        <Typography variant="small" className="mt-2 text-muted-foreground">
          Atualizado em {formatDateTime(updatedAt)}
        </Typography>
      </Box>
    </Box>
  );
}
