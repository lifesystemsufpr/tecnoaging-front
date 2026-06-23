import { Skeleton, Box } from "@/core/components/ui";

export function TabSkeleton() {
  return (
    <Box display="flex" direction="column" gap={24} className="w-full">
      {/* 4 KPI cards skeleton */}
      <Box className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Box
            key={i}
            className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
            display="flex"
            direction="column"
            gap={12}
          >
            <Box display="flex" align="center" gap={10}>
              <Skeleton variant="circular" w={40} h={40} />
              <Skeleton variant="text" w="60%" h={16} />
            </Box>
            <Skeleton variant="text" w="40%" h={32} />
            <Skeleton variant="text" w="80%" h={14} />
          </Box>
        ))}
      </Box>

      {/* Charts / content skeleton */}
      <Box className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Box
            key={i}
            className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm h-[320px]"
            display="flex"
            direction="column"
            gap={16}
          >
            <Skeleton variant="text" w="50%" h={20} />
            <Skeleton variant="rectangular" w="100%" className="flex-1 rounded-lg" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
