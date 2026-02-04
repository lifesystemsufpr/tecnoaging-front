"use client";

import { useParams } from "next/navigation";
import ParticipantDetail from "@/features/participants/containers/ParticipantDetail";

export default function Page() {
  const { id } = useParams();
  const participantId = Array.isArray(id) ? id[0] : id;

  return <ParticipantDetail participantId={participantId} />;
}
