import { Box, Button } from "@mui/material";
import { useResearcherDashboardContext } from "../../contexts/ResearcherDashboardContext";
import { GenderMode } from "../../types";

export default function DashboardMode() {
  const { genderMode, setGenderMode } = useResearcherDashboardContext();

  const handleModeChange = (mode: GenderMode) => {
    setGenderMode(mode);
  };

  return (
    <Box display="flex" gap={2} mb={3}>
      <Button
        variant={genderMode === "all" ? "contained" : "outlined"}
        onClick={() => handleModeChange("all")}
      >
        Todos
      </Button>
      <Button
        variant={genderMode === "male" ? "contained" : "outlined"}
        onClick={() => handleModeChange("male")}
      >
        Masculino
      </Button>
      <Button
        variant={genderMode === "female" ? "contained" : "outlined"}
        onClick={() => handleModeChange("female")}
      >
        Feminino
      </Button>
    </Box>
  );
}
