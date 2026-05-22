"use client";
import * as React from "react";
import { Box, Typography } from "@/core/components/ui";

export const InfoItem: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => (
  <Box>
    <Typography variant="caption" className="mb-1 block">
      {label}
    </Typography>
    <Typography variant="body" className="font-semibold">
      {value ?? "Sem informações"}
    </Typography>
  </Box>
);
