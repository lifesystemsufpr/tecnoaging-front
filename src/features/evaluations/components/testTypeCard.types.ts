import { SvgIconComponent } from "@mui/icons-material";

export interface TestTypeConfig {
  id: string;
  label: string;
  description: string;
  icon: SvgIconComponent;
  active: boolean;
  color: string;
}
