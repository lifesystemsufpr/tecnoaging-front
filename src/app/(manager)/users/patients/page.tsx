"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Patient } from "@/types/domain/Patient";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GenericTable } from "@/components/datatable/GenericTable";
import { UserCreateForm } from "@/components/form/user-create";
import { SystemRoles } from "@/types/enums/system-roles";
import { useSession } from "next-auth/react";
import { deletePatient, fetchPatients } from "@/services/api-patient";
import { useRouter } from "next/navigation";
import { PageSizeOption } from "@/types/enums/page-size-options";

const DEBOUNCE_DELAY = 500;

export default function PatientsCRUDPage() {
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [patientFilter, setPatientFilter] = useState<Patient[] | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();
  const theme = useTheme();
  const isNotebook = useMediaQuery(theme.breakpoints.down("lg"));

  const [paginationModel, setPaginationModel] = useState<{
    pageSize: PageSizeOption;
    page: number;
  }>({
    pageSize: 20,
    page: 0,
  });

  const [totalRows, setTotalRows] = useState(0);

  const loadPatients = useCallback(
    async (token: string, query?: string) => {
      try {
        const { data, meta } = await fetchPatients(
          token,
          paginationModel.page + 1,
          paginationModel.pageSize,
          query
        );
        setPatientsList(data);
        setTotalRows(meta.total);
      } catch (e) {
        console.error(e);
      }
    },
    [paginationModel]
  );

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;

    (async () => {
      loadPatients(session.accessToken);
    })();
  }, [status, session?.accessToken, paginationModel]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery) {
        loadPatients(session.accessToken);
        setTotalRows(patientsList.length);
        return;
      }

      const onlyLetters = /^[A-Za-z\s]+$/.test(searchQuery);
      const onlyNumbers = /^[0-9]+$/.test(searchQuery);

      if (onlyLetters || onlyNumbers) {
        loadPatients(session.accessToken, searchQuery);
      }
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchQuery, session.accessToken, patientsList]);

  const handleDeletePatient = async (id: string) => {
    if (!session?.accessToken) return;
    await deletePatient(session.accessToken, id);
    await loadPatients(session.accessToken);
  };

  const handleUpdatePatient = (id: string) => {
    setSelectedPatient(patientsList.find((p) => p.id === id) || null);
    setOpenModal(true);
  };

  if (status === "loading") {
    return <Typography>Carregando…</Typography>;
  }
  if (status !== "authenticated" || !session) {
    return (
      <Typography>
        Você precisa estar logado para acessar essa página.
      </Typography>
    );
  }

  return (
    <Box>
      <h1>Gerenciar Pacientes</h1>
      <Box
        mb={1}
        mt={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          label="Buscar Paciente"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Adicionar Paciente
        </Button>
      </Box>

      <GenericTable
        rows={patientFilter ?? patientsList}
        columns={[
          { key: "fullName", header: "Nome Completo" },
          { key: "cpf", header: "CPF" },
          { key: "phone", header: "Telefone" },
          { key: "state", header: "Estado" },
        ]}
        getRowId={(row) => row.id}
        showActions
        onEdit={(patient) => handleUpdatePatient(patient.id)}
        onDelete={(patient) => handleDeletePatient(patient.id)}
        onView={(patient) => router.push(`/users/patients/${patient.id}`)}
        pageSize={5}
        autoHeight
        totalRows={totalRows}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedPatient(null);
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ zIndex: 14 }}
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
          }}
        >
          <UserCreateForm
            lockedRole={SystemRoles.PATIENT}
            editUser={selectedPatient}
            onHandle={async () => {
              setOpenModal(false);
              setSelectedPatient(null);
              if (session?.accessToken) await loadPatients(session.accessToken);
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
