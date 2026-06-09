import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Participant } from "@/core/types";

type ParticipantCrudContextValue = {
  isUpsertDialogOpen: boolean;
  selectedParticipant: Participant | null;
  isDeleteDialogOpen: boolean;
  participantPendingDeletion: Participant | null;
  isEditing: boolean;
  openCreateModal: () => void;
  openEditModal: (participant: Participant) => void;
  closeUpsertModal: () => void;
  openDeleteDialog: (participant: Participant) => void;
  closeDeleteDialog: () => void;
};

type ParticipantCrudProviderProps = {
  children: ReactNode;
};

const ParticipantCrudContext =
  createContext<ParticipantCrudContextValue | null>(null);

export function ParticipantCrudProvider({
  children,
}: ParticipantCrudProviderProps) {
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [participantPendingDeletion, setParticipantPendingDeletion] =
    useState<Participant | null>(null);

  const openCreateModal = useCallback(() => {
    setSelectedParticipant(null);
    setIsUpsertDialogOpen(true);
  }, []);

  const openEditModal = useCallback((participant: Participant) => {
    setSelectedParticipant(participant);
    setIsUpsertDialogOpen(true);
  }, []);

  const closeUpsertModal = useCallback(() => {
    setIsUpsertDialogOpen(false);
    setSelectedParticipant(null);
  }, []);

  const openDeleteDialog = useCallback((participant: Participant) => {
    setParticipantPendingDeletion(participant);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setParticipantPendingDeletion(null);
  }, []);

  const value = useMemo<ParticipantCrudContextValue>(
    () => ({
      isUpsertDialogOpen,
      selectedParticipant,
      isDeleteDialogOpen,
      participantPendingDeletion,
      isEditing: Boolean(selectedParticipant),
      openCreateModal,
      openEditModal,
      closeUpsertModal,
      openDeleteDialog,
      closeDeleteDialog,
    }),
    [
      isUpsertDialogOpen,
      selectedParticipant,
      isDeleteDialogOpen,
      participantPendingDeletion,
    ]
  );

  return (
    <ParticipantCrudContext.Provider value={value}>
      {children}
    </ParticipantCrudContext.Provider>
  );
}

export function useParticipantCrudContext() {
  const context = useContext(ParticipantCrudContext);

  if (!context) {
    throw new Error(
      "useParticipantCrudContext deve ser usado dentro de um ParticipantCrudProvider"
    );
  }

  return context;
}
