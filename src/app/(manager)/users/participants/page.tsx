"use client";

import {
  ParticipantCrudPage,
  ParticipantCrudProvider,
} from "@/features/participants";

export default function ParticipantRoute() {
  return (
    <ParticipantCrudProvider>
      <ParticipantCrudPage />
    </ParticipantCrudProvider>
  );
}
