import { Box, Card, Grid, Separator, Skeleton } from "@/core/components/ui";

export default function DatailLoading() {
  return (
    <Card
      variant="outlined"
      className="w-full border shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-transform border-gray-200"
    >
      <Box direction="row" align="center">
        <Skeleton variant="circular" w={56} h={56} />
        <Box display="flex" direction="column" gap={4} w="100%">
          <Skeleton variant="text" w={280} h={32} />
          <Skeleton variant="text" w={180} />
        </Box>
        <Skeleton variant="rectangular" w={120} h={32} />
      </Box>
      <Separator className="my-3" />
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
            <Skeleton variant="text" w="60%" />
            <Skeleton variant="text" w="80%" />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
