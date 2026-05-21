import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { EducationUnit } from "../types";

type EducationalUnitCrudContextValue = {
  isUpsertDialogOpen: boolean;
  selectedEducationalUnit: EducationUnit | null;
  isDeleteDialogOpen: boolean;
  educationalUnitPendingDeletion: EducationUnit | null;
  isEditing: boolean;
  openCreateModal: () => void;
  openEditModal: (educationalUnit: EducationUnit) => void;
  closeUpsertModal: () => void;
  openDeleteDialog: (educationalUnit: EducationUnit) => void;
  closeDeleteDialog: () => void;
};

type EducationalUnitCrudProviderProps = {
  children: ReactNode;
};

const EducationalUnitCrudContext =
  createContext<EducationalUnitCrudContextValue | null>(null);

export function EducationalUnitCrudProvider({
  children,
}: EducationalUnitCrudProviderProps) {
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);
  const [selectedEducationalUnit, setSelectedEducationalUnit] =
    useState<EducationUnit | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [educationalUnitPendingDeletion, setEducationalUnitPendingDeletion] =
    useState<EducationUnit | null>(null);

  const openCreateModal = useCallback(() => {
    setSelectedEducationalUnit(null);
    setIsUpsertDialogOpen(true);
  }, []);

  const openEditModal = useCallback((educationalUnit: EducationUnit) => {
    setSelectedEducationalUnit(educationalUnit);
    setIsUpsertDialogOpen(true);
  }, []);

  const closeUpsertModal = useCallback(() => {
    setIsUpsertDialogOpen(false);
    setSelectedEducationalUnit(null);
  }, []);

  const openDeleteDialog = useCallback((educationalUnit: EducationUnit) => {
    setEducationalUnitPendingDeletion(educationalUnit);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setEducationalUnitPendingDeletion(null);
  }, []);

  const value = useMemo<EducationalUnitCrudContextValue>(
    () => ({
      isUpsertDialogOpen,
      selectedEducationalUnit,
      isDeleteDialogOpen,
      educationalUnitPendingDeletion,
      isEditing: Boolean(selectedEducationalUnit),
      openCreateModal,
      openEditModal,
      closeUpsertModal,
      openDeleteDialog,
      closeDeleteDialog,
    }),
    [
      isUpsertDialogOpen,
      selectedEducationalUnit,
      isDeleteDialogOpen,
      educationalUnitPendingDeletion,
    ]
  );

  return (
    <EducationalUnitCrudContext.Provider value={value}>
      {children}
    </EducationalUnitCrudContext.Provider>
  );
}

export function useEducationalUnitCrudContext() {
  const context = useContext(EducationalUnitCrudContext);

  if (!context) {
    throw new Error(
      "useEducationalUnitCrudContext deve ser usado dentro de um EducationalUnitCrudProvider"
    );
  }

  return context;
}
