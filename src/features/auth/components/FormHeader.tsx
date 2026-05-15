import { Box, Typography } from "@/core/components/ui";

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

export default function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <Box display="flex" direction="column" align="flex-start" gap={4}>
      <Typography variant="h1" className="text-center">
        {title}
      </Typography>
      <Typography
        variant="small"
        className="text-center text-muted-foreground mt-2"
      >
        {subtitle}
      </Typography>
    </Box>
  );
}
