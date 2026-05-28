import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { HealthProfessional } from "@/core/types";

type ProfessionalCrudContextValue = {
  isUpsertDialogOpen: boolean;
  selectedProfessional: HealthProfessional | null;
  isDeleteDialogOpen: boolean;
  professionalPendingDeletion: HealthProfessional | null;
  isEditing: boolean;
  openCreateModal: () => void;
  openEditModal: (professional: HealthProfessional) => void;
  closeUpsertModal: () => void;
  openDeleteDialog: (professional: HealthProfessional) => void;
  closeDeleteDialog: () => void;
};

type ProfessionalCrudProviderProps = {
  children: ReactNode;
};

const ProfessionalCrudContext =
  createContext<ProfessionalCrudContextValue | null>(null);

export function ProfessionalCrudProvider({
  children,
}: ProfessionalCrudProviderProps) {
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] =
    useState<HealthProfessional | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [professionalPendingDeletion, setProfessionalPendingDeletion] =
    useState<HealthProfessional | null>(null);

  const openCreateModal = useCallback(() => {
    setSelectedProfessional(null);
    setIsUpsertDialogOpen(true);
  }, []);

  const openEditModal = useCallback((professional: HealthProfessional) => {
    setSelectedProfessional(professional);
    setIsUpsertDialogOpen(true);
  }, []);

  const closeUpsertModal = useCallback(() => {
    setIsUpsertDialogOpen(false);
    setSelectedProfessional(null);
  }, []);

  const openDeleteDialog = useCallback((professional: HealthProfessional) => {
    setProfessionalPendingDeletion(professional);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setProfessionalPendingDeletion(null);
  }, []);

  const value = useMemo<ProfessionalCrudContextValue>(
    () => ({
      isUpsertDialogOpen,
      selectedProfessional,
      isDeleteDialogOpen,
      professionalPendingDeletion,
      isEditing: Boolean(selectedProfessional),
      openCreateModal,
      openEditModal,
      closeUpsertModal,
      openDeleteDialog,
      closeDeleteDialog,
    }),
    [
      isUpsertDialogOpen,
      selectedProfessional,
      isDeleteDialogOpen,
      professionalPendingDeletion,
    ]
  );

  return (
    <ProfessionalCrudContext.Provider value={value}>
      {children}
    </ProfessionalCrudContext.Provider>
  );
}

export function useProfessionalCrudContext() {
  const context = useContext(ProfessionalCrudContext);

  if (!context) {
    throw new Error(
      "useProfessionalCrudContext deve ser usado dentro de um ProfessionalCrudProvider"
    );
  }

  return context;
}
