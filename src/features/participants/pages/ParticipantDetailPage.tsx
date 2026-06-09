import ParticipantFullDetail from "../containers/ParticipantFullDetail";

export function ParticipantDetailPage({
  participantId,
}: {
  participantId: string;
}) {
  return <ParticipantFullDetail participantId={participantId} />;
}
