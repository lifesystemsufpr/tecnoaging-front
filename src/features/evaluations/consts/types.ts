import { Accessibility, Activity, Armchair, Footprints } from "lucide-react";
import { TestTypeConfig } from "../components/testTypeCard.types";

export const TEST_TYPES: TestTypeConfig[] = [
  {
    id: "TTSTS",
    label: "30STS",
    description: "30-Second Chair Stand Test",
    icon: Accessibility,
    active: true,
    color: "#42A5F5",
  },
  {
    id: "FTSTS",
    label: "5TSTS",
    description: "Five Times Sit-to-Stand Test",
    icon: Armchair,
    active: false,
    color: "#7E57C2",
  },
  {
    id: "TMSTS",
    label: "2MST",
    description: "2-Minute Step Test",
    icon: Activity,
    active: true,
    color: "#66BB6A",
  },
  {
    id: "TUG",
    label: "TUG",
    description: "Timed Up and Go",
    icon: Footprints,
    active: false,
    color: "#FFA726",
  },
];
