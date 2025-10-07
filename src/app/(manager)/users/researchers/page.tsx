"use client";

import { GenericTable } from "@/components/datatable/GenericTable";
import {
  Box,
  Button,
  Modal,
  Skeleton,
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
  const [filteredResearchers, setFilteredResearchers] = useState<
    Researcher[] | null
  >(null);

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

  const searchResearchers = async (query: string) => {
    if (!query) {
      loadResearchers();
      return;
    }
    const onlyLetters = /^[A-Za-z\s]+$/.test(query);
    const onlyNumbers = /^[0-9]+$/.test(query);
    if (onlyLetters || onlyNumbers) loadResearchers(query);
    else {
      setResearchersList([]);
      setPaginationModel({ page: 0, pageSize: 20 });
      setTotalRows(0);
    }
  };

  const safeSetResearchers = useCallback((rows: Researcher[]) => {
    if (mountedRef.current) setResearchersList(rows);
  }, []);

  const safeSetOpenModal = useCallback((v: boolean) => {
    if (mountedRef.current) setOpenModal(v);
  }, []);

  const loadResearchers = useCallback(
    async (search?: string) => {
      if (status !== "authenticated" || !session?.accessToken) return;

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
        safeSetResearchers([]);
        setLoading(false);
      }
    },
    [status, session?.accessToken, safeSetResearchers, paginationModel]
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
        mb={2}
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

      {loading ? (
        <Box>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{
              borderRadius: 1,
            }}
          />
        </Box>
      ) : (
        <GenericTable<Researcher>
          rows={filteredResearchers ?? researchersList}
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
              header: "Área de Estudo",
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
        />
      )}

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
