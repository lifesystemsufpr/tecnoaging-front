"use client";
import ParticipantEvaluations from "@/features/evaluations/containers/ParticipantEvaluations";
import { useParams } from "next/navigation";

export default function PatientsEvaluationsPage() {
  const params = useParams();
  const participantId = params.id as string;
  return <ParticipantEvaluations participantId={participantId} />;
}
