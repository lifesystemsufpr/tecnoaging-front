"use client";

import { HealthProfessionalDetailContent } from "@/components/common/user/HealthProfessionalDetailContent";
import { PatientDefailtContent } from "@/components/common/user/PatientDetailContent";
import { UserDetailContent } from "@/components/common/user/UserDetailContent";
import { UserDetailHeader } from "@/components/common/user/UserDetailHeader";
import { fetchHealthProfessionalById } from "@/services/api-health-professional";
import { fetchPatientById } from "@/services/api-patient";
import { fetchResearcherById } from "@/services/api-researcher";
import { HealthProfessionalResponse } from "@/types/api/Health-professional";
import { PatientResponse } from "@/types/api/Patient";
import { ResearcherResponse } from "@/types/api/Researcher";
import { SystemRoles } from "@/types/enums/system-roles";
import { rolePt } from "@/utils/format";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { ResearcherDetailContent } from "@/components/common/user/ResearcherDetailContent";

export default function ProfilePage() {
  const [userData, setUserData] = useState<
    PatientResponse | ResearcherResponse | HealthProfessionalResponse
  >(null);

  const router = useRouter();
  const session = useSession();

  const fetchUserData = async (accessToken: string) => {
    try {
      let resp:
        | PatientResponse
        | ResearcherResponse
        | HealthProfessionalResponse;
      switch (session.data.user.role) {
        case SystemRoles.HEALTH_PROFESSIONAL:
          resp = await fetchHealthProfessionalById({
            accessToken: accessToken,
            id: session.data.user.id,
          });
          break;
        case SystemRoles.PATIENT:
          resp = await fetchPatientById({
            access_token: accessToken,
            id: session.data.user.id,
          });
          break;

        case SystemRoles.RESEARCHER:
          resp = await fetchResearcherById({
            access_token: accessToken,
            id: session.data.user.id,
          });
          break;

        default:
          break;
      }
      setUserData(resp);
    } catch (error) {}
  };

  useEffect(() => {
    if (session.data?.user) {
      fetchUserData(session.data.accessToken);
    }
  }, [session.data]);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component="button"
            onClick={() => router.push("/")}
            underline="hover"
            color="inherit"
          >
            Perfil
          </Link>
          <Typography color="text.primary">{"Detalhes"}</Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/")}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {}}
            disabled={true}
          >
            Editar
          </Button>
        </Stack>
      </Stack>
      {userData ? (
        <Paper sx={{ p: 3 }}>
          <UserDetailHeader
            active={userData.active}
            name={userData.fullName}
            entity={rolePt(userData.role)}
            updatedAt={userData.updatedAt}
          />

          <Divider sx={{ my: 3 }} />

          <UserDetailContent {...userData} />
          {userData.role === SystemRoles.HEALTH_PROFESSIONAL ? (
            <HealthProfessionalDetailContent
              {...(userData as HealthProfessionalResponse)}
            />
          ) : userData.role === SystemRoles.PATIENT ? (
            <PatientDefailtContent {...(userData as PatientResponse)} />
          ) : userData.role === SystemRoles.RESEARCHER ? (
            <ResearcherDetailContent {...(userData as ResearcherResponse)} />
          ) : null}
        </Paper>
      ) : (
        <Typography>Loading user data...</Typography>
      )}
    </Box>
  );
}
