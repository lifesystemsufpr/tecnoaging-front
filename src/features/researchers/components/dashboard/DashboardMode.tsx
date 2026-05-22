import { Box, Button } from "@/core/components/ui";
import { useResearcherDashboardContext } from "../../contexts/ResearcherDashboardContext";
import { GenderMode } from "../../types";

export default function DashboardMode() {
  const { genderMode, setGenderMode } = useResearcherDashboardContext();

  const handleModeChange = (mode: GenderMode) => {
    setGenderMode(mode);
  };

  return (
    <Box display="flex" gap={12} mb={3}>
      <Button
        variant={genderMode === "all" ? "default" : "outline"}
        onClick={() => handleModeChange("all")}
      >
        Todos
      </Button>
      <Button
        variant={genderMode === "male" ? "default" : "outline"}
        onClick={() => handleModeChange("male")}
      >
        Masculino
      </Button>
      <Button
        variant={genderMode === "female" ? "default" : "outline"}
        onClick={() => handleModeChange("female")}
      >
        Feminino
      </Button>
    </Box>
  );
}
