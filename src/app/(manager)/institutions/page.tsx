"use client";

import { GenericTable } from "@/components/datatable/GenericTable";
import { FormRoot } from "@/components/form/container/FormProvider";
import { SearchInput } from "@/components/form/input/SearchInput";
import { InstitutionForm } from "@/components/form/study-unit";
import {
  deleteInstitution,
  fetchInstitutions,
} from "@/services/api-study-institution";
import { Institution } from "@/types/domain/Institution";
import { Box, Button, Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function InstitutionsPage() {
  const [InstitutionsList, setInstitutionsList] = useState<Institution[]>([]);

  const [searchTitle, setSearchTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;

  // enquanto carrega a sessão, não renderize a tabela

  const loadHealth = useCallback(async () => {
    if (!token) return;
    let active = true;
    setLoading(true);
    try {
      const { data } = await fetchInstitutions({
        access_token: token,
        title: searchTitle,
      });
      if (active) setInstitutionsList(data);
    } catch (e) {
      console.error(e);
      if (active) toast.error("Erro ao carregar unidades de saúde");
    } finally {
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [token, searchTitle]);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  const handleDeleteHealth = useCallback(
    async (id: string) => {
      try {
        await deleteInstitution({
          id,
        });
        await loadHealth();
      } catch (error) {
        console.error("Failed to delete health unit:", error);
        toast.error("Erro ao deletar instituição de ensino.");
      }
    },
    [loadHealth]
  );

  const handleSelectPatient = useCallback(
    (id: string) => {
      const Institution =
        InstitutionsList.find((unit) => unit.id === id) || null;
      setSelectedInstitution(Institution);
      setIsModalOpen(true);
    },
    [InstitutionsList]
  );

  const handleSuccess = async () => {
    await loadHealth();
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInstitution(null);
  };

  const handleSearchInstitution = useCallback((queryResult: string) => {
    if (!queryResult) return;
    setSearchTitle(queryResult);
  }, []);

  const memoizedTable = useMemo(
    () => (
      <GenericTable
        rows={InstitutionsList}
        columns={[{ key: "title", header: "Nome do Ensino" }]}
        getRowId={(row) => row.id}
        showActions
        onEdit={(u) => handleSelectPatient(u.id)}
        onDelete={(u) => handleDeleteHealth(u.id)}
        onView={(u) => router.push(`/institutions/${u.id}`)}
        pageSize={5}
        autoHeight
        deleteConfirmMessage={(row) => (
          <>Tem certeza que deseja excluir {row.title}?</>
        )}
        deleteConfirmTitle="Excluir Instituição de Ensino"
        loading={loading}
      />
    ),
    [InstitutionsList, loading, router, handleDeleteHealth, handleSelectPatient]
  );

  if (status === "loading") return <div>Carregando…</div>;
  if (!token)
    return <div>Você precisa estar logado para acessar essa página.</div>;

  return (
    <Box>
      <h1>Gerenciar Instituição de Ensino</h1>
      <Box
        sx={{
          mb: 1,
          mt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchInput
          onSearch={handleSearchInstitution}
          placeholder="Buscar Instituição"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 0, mb: 0 }}
          onClick={() => setIsModalOpen(true)}
        >
          Adicionar Instituição de Ensino
        </Button>
      </Box>

      {memoizedTable}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <FormRoot>
          <InstitutionForm
            initialData={selectedInstitution}
            onSuccess={handleSuccess}
            onClose={handleCloseModal}
          />
        </FormRoot>
      </Modal>
    </Box>
  );
}
