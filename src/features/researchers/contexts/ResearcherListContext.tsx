import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Researcher } from "@/core/types";

type ResearcherCrudContextValue = {
  isUpsertDialogOpen: boolean;
  selectedResearcher: Researcher | null;
  isDeleteDialogOpen: boolean;
  researcherPendingDeletion: Researcher | null;
  isEditing: boolean;
  openCreateModal: () => void;
  openEditModal: (researcher: Researcher) => void;
  closeUpsertModal: () => void;
  openDeleteDialog: (researcher: Researcher) => void;
  closeDeleteDialog: () => void;
};

type ResearcherCrudProviderProps = {
  children: ReactNode;
};

const ResearcherListContext = createContext<ResearcherCrudContextValue | null>(
  null
);

export function ResearcherCrudProvider({
  children,
}: ResearcherCrudProviderProps) {
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);
  const [selectedResearcher, setSelectedResearcher] =
    useState<Researcher | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [researcherPendingDeletion, setResearcherPendingDeletion] =
    useState<Researcher | null>(null);

  const openCreateModal = useCallback(() => {
    setSelectedResearcher(null);
    setIsUpsertDialogOpen(true);
  }, []);

  const openEditModal = useCallback((researcher: Researcher) => {
    setSelectedResearcher(researcher);
    setIsUpsertDialogOpen(true);
  }, []);

  const closeUpsertModal = useCallback(() => {
    setIsUpsertDialogOpen(false);
    setSelectedResearcher(null);
  }, []);

  const openDeleteDialog = useCallback((researcher: Researcher) => {
    setResearcherPendingDeletion(researcher);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setResearcherPendingDeletion(null);
  }, []);

  const value = useMemo<ResearcherCrudContextValue>(
    () => ({
      isUpsertDialogOpen,
      selectedResearcher,
      isDeleteDialogOpen,
      researcherPendingDeletion,
      isEditing: Boolean(selectedResearcher),
      openCreateModal,
      openEditModal,
      closeUpsertModal,
      openDeleteDialog,
      closeDeleteDialog,
    }),
    [
      isUpsertDialogOpen,
      selectedResearcher,
      isDeleteDialogOpen,
      researcherPendingDeletion,
    ]
  );

  return (
    <ResearcherListContext.Provider value={value}>
      {children}
    </ResearcherListContext.Provider>
  );
}

export function useResearcherCrudContext() {
  const context = useContext(ResearcherListContext);

  if (!context) {
    throw new Error(
      "useResearcherCrudContext deve ser usado dentro de um ResearcherCrudProvider"
    );
  }

  return context;
}
