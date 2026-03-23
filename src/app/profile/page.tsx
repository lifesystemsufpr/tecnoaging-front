"use client";

import { HealthProfessionalResponse } from "@/types/api/Health-professional";
import { PatientResponse } from "@/types/api/Patient";
import { ResearcherResponse } from "@/types/api/Researcher";
import { SystemRoles } from "@/types/enums/system-roles";
import { rolePt } from "@/utils/format";
import {
  Box,
  Divider,
  Modal,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import ProfileSkeleton from "@/core/components/shared/profile/ProfileSkeleton";
import { UserCreateForm } from "@/components/form/user-create";

import {
  ProfileNavigation,
  UserDetailContent,
  UserDetailHeader,
  DetailFeature,
} from "@/core/components/shared";

export default function ProfilePage() {
  const [userData, setUserData] = useState<
    PatientResponse | ResearcherResponse | HealthProfessionalResponse
  >(null);
  const [openEditModal, setOpenEditModal] = useState(false);

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

  return (
    <Box>
      <ProfileNavigation onEdit={() => setOpenEditModal(true)} />

      <Paper sx={{ p: 3 }}>
        <DetailFeature role={userRole} userId={userId} />
      </Paper>

      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
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
        ></Box>
      </Modal>
    </Box>
  );
}
