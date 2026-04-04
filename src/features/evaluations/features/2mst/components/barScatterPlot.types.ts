import { Gender } from "@/core/enums";

export interface BarScatterPlotProps {
  participantAge: number;
  participantSteps: number;
  participantGender: Gender;
  labelColor: string;
}
