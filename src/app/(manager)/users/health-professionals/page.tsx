"use client";
import { GenericTable } from "@/components/datatable/GenericTable";
import { UserCreateForm } from "@/components/form/user-create";
import {
  deleteHealthProfessional,
  fetchHealthProfessionals,
} from "@/services/api-health-professional";
import { HealthProfessional } from "@/types/domain/Health-professional";
import { PageSizeOption } from "@/types/enums/page-size-options";
import { SystemRoles } from "@/types/enums/system-roles";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function HealthProfessionalsCRUDPage() {
  const [HealthProfessionalsList, setHealthProfessionalsList] = useState<
    HealthProfessional[]
  >([]);
  const [filteredHealthProfessionals, setFilteredHealthProfessionals] =
    useState<HealthProfessional[] | null>(null);

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

  if (!session) {
    return (
      <Typography>
        Você precisa estar logado para acessar essa página.
      </Typography>
    );
  }

  const searchProfessionals = (query: string) => {
    if (!query) {
      loadHealthProfessionals();
      return;
    }
    const onlyLetters = /^[A-Za-z\s]+$/.test(query);
    const onlyNumbers = /^[0-9]+$/.test(query);
    if (onlyLetters || onlyNumbers) {
      loadHealthProfessionals(query);
    }
  };

  const loadHealthProfessionals = useCallback(
    async (query?: string) => {
      fetchHealthProfessionals({
        accessToken: session.accessToken,
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        query,
      })
        .then((response) => {
          const { data, meta } = response;
          setHealthProfessionalsList(data);
          setTotalRows(meta.total);
        })
        .catch((error) => {
          console.error("Error fetching health professionals:", error);
          toast.error("Erro ao carregar profissionais de saúde.");
        });
    },
    [session, paginationModel]
  );

  const handleDeleteHealthProfessional = async (id: string) => {
    try {
      await deleteHealthProfessional({
        accessToken: session.accessToken,
        id,
      }).then(() => loadHealthProfessionals());
    } catch (error) {
      console.error("Error deleting health professional:", error);
      toast.error("Erro ao deletar profissional de saúde.");
    }
  };

  const handleUpdateHealthProfessional = (id: string) => {
    setSelectedHealthProfessional(
      HealthProfessionalsList.find(
        (HealthProfessional) => HealthProfessional.id === id
      ) || null
    );
    setOpenModal(true);
  };

  useEffect(() => {
    loadHealthProfessionals();
  }, [paginationModel]);

  return (
    <Box>
      <h1>Gerenciar Profissionais de Saúde</h1>
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
          label="Buscar Profissional"
          variant="outlined"
          onChange={(e) => searchProfessionals(e.target.value)}
        />
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Adicionar Profissional
        </Button>
      </Box>
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
            header: "cpf",
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
      />

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
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
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
