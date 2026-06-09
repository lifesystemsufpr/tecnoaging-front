import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { HealthUnit } from "../types";

type HealthUnitCrudContextValue = {
  isUpsertDialogOpen: boolean;
  selectedHealthUnit: HealthUnit | null;
  isDeleteDialogOpen: boolean;
  healthUnitPendingDeletion: HealthUnit | null;
  isEditing: boolean;
  openCreateModal: () => void;
  openEditModal: (healthUnit: HealthUnit) => void;
  closeUpsertModal: () => void;
  openDeleteDialog: (healthUnit: HealthUnit) => void;
  closeDeleteDialog: () => void;
};

type HealthUnitCrudProviderProps = {
  children: ReactNode;
};

const HealthUnitCrudContext = createContext<HealthUnitCrudContextValue | null>(
  null
);

export function HealthUnitCrudProvider({
  children,
}: HealthUnitCrudProviderProps) {
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);
  const [selectedHealthUnit, setSelectedHealthUnit] =
    useState<HealthUnit | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [healthUnitPendingDeletion, setHealthUnitPendingDeletion] =
    useState<HealthUnit | null>(null);

  const openCreateModal = useCallback(() => {
    setSelectedHealthUnit(null);
    setIsUpsertDialogOpen(true);
  }, []);

  const openEditModal = useCallback((healthUnit: HealthUnit) => {
    setSelectedHealthUnit(healthUnit);
    setIsUpsertDialogOpen(true);
  }, []);

  const closeUpsertModal = useCallback(() => {
    setIsUpsertDialogOpen(false);
    setSelectedHealthUnit(null);
  }, []);

  const openDeleteDialog = useCallback((healthUnit: HealthUnit) => {
    setHealthUnitPendingDeletion(healthUnit);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setHealthUnitPendingDeletion(null);
  }, []);

  const value = useMemo<HealthUnitCrudContextValue>(
    () => ({
      isUpsertDialogOpen,
      selectedHealthUnit,
      isDeleteDialogOpen,
      healthUnitPendingDeletion,
      isEditing: Boolean(selectedHealthUnit),
      openCreateModal,
      openEditModal,
      closeUpsertModal,
      openDeleteDialog,
      closeDeleteDialog,
    }),
    [
      isUpsertDialogOpen,
      selectedHealthUnit,
      isDeleteDialogOpen,
      healthUnitPendingDeletion,
    ]
  );

  return (
    <HealthUnitCrudContext.Provider value={value}>
      {children}
    </HealthUnitCrudContext.Provider>
  );
}

export function useHealthUnitCrudContext() {
  const context = useContext(HealthUnitCrudContext);

  if (!context) {
    throw new Error(
      "useHealthUnitCrudContext deve ser usado dentro de um HealthUnitCrudProvider"
    );
  }

  return context;
}
