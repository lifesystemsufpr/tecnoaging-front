"use client";
import { GenericTable } from "@/components/datatable/GenericTable";
import { SearchInput } from "@/components/form/input/SearchInput";
import { UserCreateForm } from "@/components/form/user-create";
import {
  deleteHealthProfessional,
  fetchHealthProfessionals,
} from "@/services/api-health-professional";
import { HealthProfessional } from "@/types/domain/Health-professional";
import { PageSizeOption } from "@/types/enums/page-size-options";
import { SystemRoles } from "@/types/enums/system-roles";
import { Box, Button, Modal, useMediaQuery, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function HealthProfessionalsCRUDPage() {
  const [HealthProfessionalsList, setHealthProfessionalsList] = useState<
    HealthProfessional[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState<{
    pageSize: PageSizeOption;
    page: number;
  }>({
    pageSize: 20,
    page: 0,
  });

  const [totalRows, setTotalRows] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [selectedHealthProfessional, setSelectedHealthProfessional] =
    useState<HealthProfessional | null>(null);

  const router = useRouter();

  const { data: session } = useSession();
  const theme = useTheme();
  const isNotebook = useMediaQuery(theme.breakpoints.down("lg"));

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const loadHealthProfessionals = useCallback(async () => {
    setLoading(true);
    fetchHealthProfessionals({
      accessToken: session.accessToken,
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      query: searchQuery || undefined,
    })
      .then((response) => {
        const { data, meta } = response;
        setHealthProfessionalsList(data);
        setTotalRows(meta.total);
      })
      .catch((error) => {
        console.error("Error fetching health professionals:", error);
        toast.error("Erro ao carregar profissionais de saúde.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session?.accessToken, paginationModel, searchQuery]);

  const searchProfessionals = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setSearchQuery(query);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 800);
  }, []);

  const handleDeleteHealthProfessional = useCallback(
    async (id: string) => {
      try {
        await deleteHealthProfessional({
          accessToken: session.accessToken,
          id,
        }).then(() => loadHealthProfessionals());
      } catch (error) {
        console.error("Error deleting health professional:", error);
        toast.error("Erro ao deletar profissional de saúde.");
      }
    },
    [session?.accessToken, loadHealthProfessionals]
  );

  const handleUpdateHealthProfessional = useCallback(
    (id: string) => {
      setSelectedHealthProfessional(
        HealthProfessionalsList.find(
          (HealthProfessional) => HealthProfessional.id === id
        ) || null
      );
      setOpenModal(true);
    },
    [HealthProfessionalsList]
  );

  useEffect(() => {
    loadHealthProfessionals();
  }, [loadHealthProfessionals]);

  const memoizedTable = useMemo(
    () => (
      <GenericTable
        rows={HealthProfessionalsList}
        columns={[
          {
            key: "fullName",
            header: "Nome Completo",
            render(p) {
              return <>{p.row?.fullName}</>;
            },
          },
          {
            key: "email",
            header: "Email",
            render(p) {
              return <>{p.row?.email}</>;
            },
          },
          {
            key: "cpf",
            header: "CPF",
            render(p) {
              return <>{p.row?.cpf}</>;
            },
          },
        ]}
        getRowId={(row) => row.id}
        showActions
        onEdit={(HealthProfessional) =>
          handleUpdateHealthProfessional(HealthProfessional.id)
        }
        onDelete={(HealthProfessional) =>
          handleDeleteHealthProfessional(HealthProfessional.id)
        }
        onView={(HealthProfessional) => {
          router.push(`/users/health-professionals/${HealthProfessional?.id}`);
        }}
        pageSize={5}
        autoHeight
        totalRows={totalRows}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        loading={loading}
        deleteConfirmMessage={(row) => (
          <>Tem certeza que deseja excluir {row.fullName}?</>
        )}
        deleteConfirmTitle="Excluir profissional de saúde"
      />
    ),
    [
      HealthProfessionalsList,
      loading,
      paginationModel,
      totalRows,
      router,
      handleDeleteHealthProfessional,
      handleUpdateHealthProfessional,
    ]
  );

  return (
    <Box>
      <h1>Gerenciar Profissionais de Saúde</h1>
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
          onSearch={searchProfessionals}
          placeholder="Buscar Profissional de Saúde"
        />
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Adicionar Profissional
        </Button>
      </Box>

      {memoizedTable}

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedHealthProfessional(null);
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          zIndex: 14,
        }}
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
            lockedRole={SystemRoles.HEALTH_PROFESSIONAL}
            editUser={selectedHealthProfessional}
            onHandle={() => {
              setOpenModal(false);
              setSelectedHealthProfessional(null);
              loadHealthProfessionals();
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
