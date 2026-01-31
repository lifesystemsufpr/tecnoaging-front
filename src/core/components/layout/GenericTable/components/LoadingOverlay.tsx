import { Box, Skeleton } from "@mui/material";
import { memo } from "react";

const DEFAULT_SKELETON_ROWS = 6;

export type LoadingOverlayProps = {
  columnCount?: number;
  rowCount?: number;
};

export const LoadingSkeletonOverlay = memo(
  ({
    columnCount = 1,
    rowCount = DEFAULT_SKELETON_ROWS,
    ...other
  }: LoadingOverlayProps) => {
    const safeColumnCount = Math.max(1, columnCount);
    const safeRowCount = Math.max(1, rowCount);

    return (
      <Box
        {...other}
        sx={{
          width: "100%",
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {Array.from({ length: safeRowCount }).map((_, rowIdx) => (
          <Box
            key={rowIdx}
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${safeColumnCount}, minmax(80px, 1fr))`,
              gap: 1,
            }}
          >
            {Array.from({ length: safeColumnCount }).map((__, colIdx) => (
              <Skeleton key={colIdx} variant="rounded" height={28} />
            ))}
          </Box>
        ))}
      </Box>
    );
  }
);

LoadingSkeletonOverlay.displayName = "LoadingSkeletonOverlay";
