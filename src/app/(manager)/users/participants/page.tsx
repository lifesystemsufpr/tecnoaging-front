"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Patient } from "@/types/domain/Patient";
import {
  Box,
  Button,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ColumnConfig,
  GenericTable,
} from "@/components/datatable/GenericTable";
import { UserCreateForm } from "@/components/form/user-create";
import { SystemRoles } from "@/types/enums/system-roles";
import { useSession } from "next-auth/react";
import { deletePatient, fetchPatients } from "@/services/api-patient";
import { useRouter } from "next/navigation";
import { PageSizeOption } from "@/types/enums/page-size-options";
import { SearchInput } from "@/components/form/input/SearchInput";
import ROUTES from "@/config/routes";

const columnsConfig: ColumnConfig<Patient>[] = [
  { key: "fullName", header: "Nome Completo" },
  { key: "cpf", header: "CPF" },
  { key: "phone", header: "Telefone" },
  { key: "state", header: "Estado" },
];

export default function PatientsCRUDPage() {
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleViewTests = useCallback(
    (id: string) => {
      router.push(ROUTES.USERS.PARTICIPANTS.EVALUATIONS(id));
    },
    [router]
  );

  const handleViewQuestionnaires = useCallback(
    (id: string) => {
      router.push(ROUTES.USERS.PARTICIPANTS.QUESTIONNAIRES(id));
    },
    [router]
  );

  const loadPatients = useCallback(
    async (
      token: string,
      params?: { query?: string; page?: number; pageSize?: number }
    ) => {
      try {
        setLoading(true);

        const page = params?.page ?? paginationModel.page;
        const pageSize = params?.pageSize ?? paginationModel.pageSize;

        const { data, meta } = await fetchPatients(
          token,
          page + 1,
          pageSize,
          params?.query
        );

        setPatientsList(data);
        setTotalRows(meta.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [paginationModel.page, paginationModel.pageSize]
  );

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;

    (async () => {
      loadPatients(session.accessToken);
    })();
  }, [status, session?.accessToken, paginationModel, loadPatients]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;

    if (!searchQuery) {
      loadPatients(session.accessToken);
      return;
    }

    const onlyLetters = /^[A-Za-z\s]+$/.test(searchQuery);
    const onlyNumbers = /^[0-9]+$/.test(searchQuery);

    if (onlyLetters || onlyNumbers) {
      loadPatients(session.accessToken, { query: searchQuery });
    }
  }, [searchQuery, session?.accessToken, status, loadPatients]);

  const handleDeletePatient = useCallback(
    async (id: string) => {
      if (!session?.accessToken) return;
      await deletePatient(session.accessToken, id);
      await loadPatients(session.accessToken);
    },
    [session?.accessToken, loadPatients]
  );

  const handleUpdatePatient = useCallback(
    (id: string) => {
      setSelectedPatient(patientsList.find((p) => p.id === id) || null);
      setOpenModal(true);
    },
    [patientsList]
  );

  const handleEdit = useCallback(
    (p: Patient) => handleUpdatePatient(p.id),
    [handleUpdatePatient]
  );
  const handleDelete = useCallback(
    (p: Patient) => handleDeletePatient(p.id),
    [handleDeletePatient]
  );

  const memoizedTable = useMemo(
    () => (
      <GenericTable
        rows={patientsList}
        columns={columnsConfig}
        getRowId={(row) => row.id}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(patient) =>
          router.push(ROUTES.USERS.PARTICIPANTS.DETAIL(patient.id))
        }
        pageSize={5}
        autoHeight
        totalRows={totalRows}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        loading={loading}
        deleteConfirmMessage={(row) => (
          <>Tem certeza que deseja excluir {row.fullName}?</>
        )}
        deleteConfirmTitle="Excluir paciente"
      />
    ),
    [
      patientsList,
      loading,
      paginationModel,
      totalRows,
      handleDelete,
      handleEdit,
      handleViewQuestionnaires,
      handleViewTests,
      router,
    ]
  );

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
      <h1>Gerenciar Participantes</h1>
      <Box
        mb={1}
        mt={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchInput
          onSearch={setSearchQuery}
          placeholder="Buscar Participante"
        />
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Adicionar Participante
        </Button>
      </Box>

      {memoizedTable}

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
