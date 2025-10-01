"use client";
import * as React from "react";
import { Box, Typography } from "@mui/material";

export const InfoItem: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => (
  <Box>
    <Typography
      variant="caption"
      sx={{ color: "text.secondary", mb: 0.5, display: "block" }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {value ?? "Sem informações"}
    </Typography>
  </Box>
);
