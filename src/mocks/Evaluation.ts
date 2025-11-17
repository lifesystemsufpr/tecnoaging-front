import { Cycle } from "@/types/domain/Evaluation";

export const CycleMock: Cycle = {
  C1: { total: 12, stand: 8, sit: 4 },
  C2: { total: 10, stand: 6, sit: 4 },
  C3: { total: 14, stand: 9, sit: 5 },
  C4: { total: 11, stand: 7, sit: 4 },
  C5: { total: 13, stand: 8, sit: 5 },
  C6: { total: 9, stand: 5, sit: 4 },
  C7: { total: 15, stand: 10, sit: 5 },
  min: { total: 9, stand: 5, sit: 4, cycle: "C6" },
  max: { cycle: "C7", total: 15, stand: 10, sit: 5 },
  avg: { total: 12.43, stand: 7.57, sit: 4.86 },
};
