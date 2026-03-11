import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import { TestTypeConfig } from "../components/testTypeCard.types";

export const TEST_TYPES: TestTypeConfig[] = [
  {
    id: "TTSTS",
    label: "30STS",
    description: "30-Second Chair Stand Test",
    icon: AccessibilityNewIcon,
    active: true,
    color: "#42A5F5",
  },
  {
    id: "FTSTS",
    label: "5TSTS",
    description: "Five Times Sit-to-Stand Test",
    icon: AirlineSeatReclineNormalIcon,
    active: false,
    color: "#7E57C2",
  },
  {
    id: "2MST",
    label: "2MST",
    description: "2-Minute Step Test",
    icon: DirectionsRunIcon,
    active: false,
    color: "#66BB6A",
  },
  {
    id: "TUG",
    label: "TUG",
    description: "Timed Up and Go",
    icon: DirectionsWalkIcon,
    active: false,
    color: "#FFA726",
  },
];
