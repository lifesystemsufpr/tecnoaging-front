"use client";

import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";

import { SystemRoles } from "@/core/enums";
import { ProfileNavigation, DetailFeature } from "@/core/components/shared";
import { HealthProfessional, Participant, Researcher } from "@/core/types";
import { Box, Card } from "@/core/components/ui";

type EditableUser = Researcher | Participant | HealthProfessional;

const EDITABLE_ROLES = new Set<SystemRoles>([
  SystemRoles.RESEARCHER,
  SystemRoles.PATIENT,
  SystemRoles.HEALTH_PROFESSIONAL,
]);

export default function ProfilePage() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editableUser, setEditableUser] = useState<EditableUser | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

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

      <Card variant="elevated" padding="md" className="border-0">
        <DetailFeature
          key={`${userRole}-${userId}-${refreshTick}`}
          role={userRole}
          userId={userId}
          onUserDataLoaded={handleUserDataLoaded}
        />
      </Card>
    </Box>
  );
}
