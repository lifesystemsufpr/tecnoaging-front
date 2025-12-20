import { Box, BoxProps, Paper, useMediaQuery, useTheme } from "@mui/material";

type FormContainerProps = BoxProps & {
  children: React.ReactNode;
};

export function FormContainer({ children, ...props }: FormContainerProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 2,
        width: "100%",
        mx: "auto",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        component="form"
        noValidate
        {...props}
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "hidden",
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

export function FormRoot({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isNotebook = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isNotebook ? "90%" : "50%",
      }}
    >
      {children}
    </Box>
  );
}
