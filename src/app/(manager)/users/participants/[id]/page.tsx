"use client";

import { useParams } from "next/navigation";
import ParticipantFullDetail from "@/features/participants/containers/ParticipantFullDetail";

export default function Page() {
  const { id } = useParams();
  const participantId = Array.isArray(id) ? id[0] : id;

  return <ParticipantFullDetail participantId={participantId} />;
}
