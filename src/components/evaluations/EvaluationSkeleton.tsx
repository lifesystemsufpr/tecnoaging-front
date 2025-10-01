"use client";
import * as React from "react";
import { Skeleton, Stack } from "@mui/material";

export default function EvaluationSkeleton() {
  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Skeleton variant="text" width={220} height={28} />
      <Skeleton variant="text" width={160} height={22} />
      <Skeleton variant="rounded" height={320} />
      <Skeleton variant="rounded" height={320} />
    </Stack>
  );
}
