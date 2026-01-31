import { Box, Typography } from "@mui/material";
import { memo } from "react";

const DEFAULT_NO_ROWS_LABEL = "Nenhum registro encontrado";

export const EmptyStateOverlay = memo(
  ({ children, ...other }: { children?: React.ReactNode }) => (
    <Box
      {...other}
      role="presentation"
      sx={{
        width: "100%",
        py: 4,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {children || DEFAULT_NO_ROWS_LABEL}
      </Typography>
    </Box>
  )
);

EmptyStateOverlay.displayName = "EmptyStateOverlay";
