import { Box, Divider, Grid, Paper, Skeleton, Stack } from "@mui/material";

export default function DatailLoading() {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Skeleton variant="circular" width={56} height={56} />
        <Box flex={1}>
          <Skeleton variant="text" width={280} height={32} />
          <Skeleton variant="text" width={180} />
        </Box>
        <Skeleton variant="rectangular" width={120} height={32} />
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} size={12}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
