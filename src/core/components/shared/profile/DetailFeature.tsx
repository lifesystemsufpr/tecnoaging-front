import { SystemRoles } from "@/core/enums";

import { ManagerDetail } from "@/features/managers";
import { ParticipantDetail } from "@/features/participants";
import { DetailProfessional } from "@/features/professionals";
import { DetailResearcher } from "@/features/researchers";

export interface DetailFeatureProps {
  userId: string;
  role: SystemRoles;
}

export function DetailFeature({ userId, role }: DetailFeatureProps) {
  console.log("DetailFeature Props:", { userId, role }); // Debug log

  switch (role) {
    case SystemRoles.MANAGER:
      return <ManagerDetail managerId={userId} />;
    case SystemRoles.PATIENT:
      return <ParticipantDetail participantId={userId} />;
    case SystemRoles.HEALTH_PROFESSIONAL:
      return <DetailProfessional professionalId={userId} />;
    case SystemRoles.RESEARCHER:
      return <DetailResearcher researcherId={userId} />;

    default:
      return null;
  }
}
