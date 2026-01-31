"use client";
import { useParams } from "next/navigation";
import { QuestionnairesProvider } from "@/features/questionnaires";
import ParticipantQuestionnairesContent from "@/features/questionnaires/containers/ParticipantQuestionnaires";

export default function PatientQuestionnairesPage() {
  const params = useParams();
  const patientId = params.id as string;

  return (
    <QuestionnairesProvider patientId={patientId}>
      <ParticipantQuestionnairesContent />
    </QuestionnairesProvider>
  );
}
