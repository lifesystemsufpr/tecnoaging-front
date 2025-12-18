"use client";

import { GenericTable } from "@/components/datatable/GenericTable";
import {
  Box,
  Button,
  Modal,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { deleteResearcher, fetchResearchers } from "@/services/api-researcher";
import type { Researcher } from "@/types/domain/Reseracher";
import { UserCreateForm } from "@/components/form/user-create";
import { SystemRoles } from "@/types/enums/system-roles";
import { useRouter } from "next/navigation";
import { PageSizeOption } from "@/types/enums/page-size-options";
import { toast } from "sonner";

export default function ResearcherCRUDPage() {
  const [researchersList, setResearchersList] = useState<Researcher[]>([]);

  const [paginationModel, setPaginationModel] = useState<{
    pageSize: PageSizeOption;
    page: number;
  }>({
    pageSize: 20,
    page: 0,
  });

  const [totalRows, setTotalRows] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [selectedResearcher, setSelectedResearcher] =
    useState<Researcher | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();
  const theme = useTheme();
  const isNotebook = useMediaQuery(theme.breakpoints.down("lg"));

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const safeSetResearchers = useCallback((rows: Researcher[]) => {
    if (mountedRef.current) setResearchersList(rows);
  }, []);

  const safeSetOpenModal = useCallback((v: boolean) => {
    if (mountedRef.current) setOpenModal(v);
  }, []);

  const loadResearchers = useCallback(
    async (search?: string) => {
      if (status !== "authenticated" || !session?.accessToken) return;
      setLoading(true);
      try {
        const { data, meta } = await fetchResearchers({
          access_token: session.accessToken,
          page: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
          search,
        });
        const rows = data ? (data as Researcher[]) : [];

        setTotalRows(meta.total);
        safeSetResearchers(rows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching researchers:", error);
        safeSetResearchers([]);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [status, session?.accessToken, safeSetResearchers, paginationModel]
  );

  const searchResearchers = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (!query) {
          loadResearchers();
          return;
        }

        loadResearchers(query);
      }, 500);
    },
    [loadResearchers]
  );

  useEffect(() => {
    setLoading(true);
    loadResearchers();
  }, [loadResearchers]);

  const handleDeleteResearcher = (id: string) => {
    try {
      deleteResearcher({
        id,
        access_token: session?.accessToken ?? "",
      }).then(async () => {
        await loadResearchers();
        setSelectedResearcher(null);
        toast.success("Pesquisador deletado com sucesso.");
      });
    } catch (error) {
      console.error("Error deleting researcher:", error);
    }
  };

  return (
    <Box>
      <h1>Gerenciar Pesquisadores</h1>
      <Box
        mb={1}
        mt={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          label="Buscar Pesquisador"
          onChange={(e) => searchResearchers(e.target.value)}
        />
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Adicionar Pesquisador
        </Button>
      </Box>

      <GenericTable<Researcher>
        rows={researchersList}
        columns={[
          {
            key: "fullName",
            header: "Nome",
            render: (p) => <>{p.row.fullName ?? "—"}</>,
          },
          { key: "email", header: "Email" },
          { key: "cpf", header: "CPF" },
          {
            key: "institution",
            header: "Instituição",
            render: (p) => <>{p.row?.institutionName ?? "—"}</>,
          },
          {
            key: "fieldOfStudy",
            header: "Campo de Estudo",
            render: (p) => <>{p.row.fieldOfStudy ?? "—"}</>,
          },
        ]}
        getRowId={(r) => r.id}
        showActions
        onView={(r) => {
          router.push(`/users/researchers/${r?.id}`);
        }}
        onEdit={(r) => {
          setSelectedResearcher(r);
          safeSetOpenModal(true);
        }}
        onDelete={(r) => handleDeleteResearcher(r.id)}
        totalRows={totalRows}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
        loading={loading}
        deleteConfirmMessage={(row) => (
          <>Tem certeza que deseja excluir {row.fullName}?</>
        )}
        deleteConfirmTitle="Excluir pesquisador"
      />

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedResearcher(null);
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
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
            lockedRole={SystemRoles.RESEARCHER}
            editUser={selectedResearcher}
            onHandle={() => {
              safeSetOpenModal(false);
              setSelectedResearcher(null);
              loadResearchers();
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
