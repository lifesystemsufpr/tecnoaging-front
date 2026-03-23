import { SystemRoles } from "@/core/enums";

import { ManagerDetail } from "@/features/managers";
import { ParticipantDetail } from "@/features/participants";
import { DetailProfessional } from "@/features/professionals";
import { DetailResearcher } from "@/features/researchers";

export interface DetailFeatureProps {
  userId: string;
  role: SystemRoles;
  onUserDataLoaded?: (data: unknown) => void;
}

export function DetailFeature({
  userId,
  role,
  onUserDataLoaded,
}: DetailFeatureProps) {
  switch (role) {
    case SystemRoles.MANAGER:
      return <ManagerDetail managerId={userId} />;
    case SystemRoles.PATIENT:
      return (
        <ParticipantDetail
          participantId={userId}
          onDataLoaded={onUserDataLoaded}
        />
      );
    case SystemRoles.HEALTH_PROFESSIONAL:
      return (
        <DetailProfessional
          professionalId={userId}
          onDataLoaded={onUserDataLoaded}
        />
      );
    case SystemRoles.RESEARCHER:
      return (
        <DetailResearcher
          researcherId={userId}
          onDataLoaded={onUserDataLoaded}
        />
      );

    default:
      return null;
  }
}
