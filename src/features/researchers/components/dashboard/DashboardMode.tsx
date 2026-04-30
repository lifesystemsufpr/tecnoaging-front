import { Box, Button } from "@mui/material";
import { useState } from "react";

type Mode = "all" | "male" | "female";

export default function DashboardMode() {
  const [activeMode, setActiveMode] = useState<Mode>("all");

  const handleModeChange = (mode: Mode) => {
    setActiveMode(mode);
  };

  return (
    <Box display="flex" gap={2} mb={3}>
      <Button
        variant={activeMode === "all" ? "contained" : "outlined"}
        onClick={() => handleModeChange("all")}
      >
        Todos
      </Button>
      <Button
        variant={activeMode === "male" ? "contained" : "outlined"}
        onClick={() => handleModeChange("male")}
      >
        Masculino
      </Button>
      <Button
        variant={activeMode === "female" ? "contained" : "outlined"}
        onClick={() => handleModeChange("female")}
      >
        Feminino
      </Button>
    </Box>
  );
}
