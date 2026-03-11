import { Gender } from "@/core/enums";

export interface BarScatterPlotProps {
  participantAge: number;
  participantRepetitions: number;
  participantGender: Gender;
  labelColor: string;
}
