"use client";

import { SystemRoles } from "@/core/enums";
import { Box, Modal, Paper, useMediaQuery, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";

import { UserCreateForm } from "@/components/form/user-create";
import { HealthProfessional } from "@/types/domain/Health-professional";
import { Patient } from "@/types/domain/Patient";
import { Researcher } from "@/types/domain/Reseracher";

import { ProfileNavigation, DetailFeature } from "@/core/components/shared";

type EditableUser = Researcher | Patient | HealthProfessional;

const EDITABLE_ROLES = new Set<SystemRoles>([
  SystemRoles.RESEARCHER,
  SystemRoles.PATIENT,
  SystemRoles.HEALTH_PROFESSIONAL,
]);

export default function ProfilePage() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editableUser, setEditableUser] = useState<EditableUser | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const theme = useTheme();
  const isNotebook = useMediaQuery(theme.breakpoints.down("lg"));
  const session = useSession();

  const userRole = useMemo(
    () => session.data?.user?.role as SystemRoles,
    [session.data?.user?.role]
  );
  const userId = useMemo(
    () => session.data?.user?.id || "",
    [session.data?.user?.id]
  );

  const canEditRole = useMemo(() => EDITABLE_ROLES.has(userRole), [userRole]);

  const canOpenEdit = canEditRole && !!editableUser;

  const handleUserDataLoaded = useCallback((data: unknown) => {
    setEditableUser(data as EditableUser);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenEditModal(false);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setOpenEditModal(false);
    setRefreshTick((prev) => prev + 1);
  }, []);

  return (
    <Box>
      <ProfileNavigation
        onEdit={() => setOpenEditModal(true)}
        disableEdit={true}
      />

      <Paper sx={{ p: 3 }}>
        <DetailFeature
          key={`${userRole}-${userId}-${refreshTick}`}
          role={userRole}
          userId={userId}
          onUserDataLoaded={handleUserDataLoaded}
        />
      </Paper>

      <Modal
        open={openEditModal}
        onClose={handleCloseModal}
        sx={{
          padding: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isNotebook ? "90%" : "50%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {editableUser && canEditRole ? (
            <UserCreateForm
              lockedRole={userRole}
              editUser={editableUser}
              onHandle={handleFormSuccess}
            />
          ) : null}
        </Box>
      </Modal>
    </Box>
  );
}
