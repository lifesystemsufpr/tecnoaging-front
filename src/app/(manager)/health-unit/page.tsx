"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { GenericTable } from "@/components/datatable/GenericTable";
import {
  createHealthUnit,
  deleteHealthUnit,
  fetchHealthUnits,
  updateHealthUnit,
} from "@/services/api-health-unit";
import { useSession } from "next-auth/react";
import { HealthUnit } from "@/types/domain/Health-unit";
import { HealthUnitForm } from "@/components/form/health-unit";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PatientsCRUDPage() {
  const [healthUnitsList, setHealthUnitsList] = useState<HealthUnit[]>([]);
  const [filteredHealthUnits, setFilteredHealthUnits] = useState<
    HealthUnit[] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHealthUnit, setSelectedHealthUnit] =
    useState<HealthUnit | null>(null);

  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;

  // enquanto carrega a sessão, não renderize a tabela
  if (status === "loading") return <div>Carregando…</div>;
  if (!token)
    return <div>Você precisa estar logado para acessar essa página.</div>;

  const loadHealth = useCallback(async () => {
    if (!token) return;
    let active = true;
    try {
      const data = await fetchHealthUnits(token);
      if (active) setHealthUnitsList(data);
    } catch (e) {
      if (active) toast.error("Erro ao carregar unidades de saúde");
    }
    return () => {
      active = false; // cancela setState após unmount
    };
  }, [token]);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  const handleDeleteHealth = useCallback(
    async (id: string) => {
      try {
        await deleteHealthUnit(id, token);
        await loadHealth();
      } catch (error) {
        console.error("Failed to delete health unit:", error);
        toast.error("Erro ao deletar unidade de saúde");
      }
    },
    [token, loadHealth]
  );

  const handleSelectPatient = (id: string) => {
    const healthUnit = healthUnitsList.find((unit) => unit.id === id) || null;
    setSelectedHealthUnit(healthUnit);
    setIsModalOpen(true);
  };

  const handleSearchHealth = (query: string) => {
    if (!query) return setFilteredHealthUnits(null);
    const normalizedQuery = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    setFilteredHealthUnits(
      healthUnitsList.filter((u) =>
        u.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    );
  };

  return (
    <Box>
      <h1>Gerenciar Unidades de Saúde</h1>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Buscar unidades de saúde"
          onChange={(e) => handleSearchHealth(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => setIsModalOpen(true)}
        >
          Adicionar Unidades de Saúde
        </Button>
      </Box>

      <GenericTable
        rows={filteredHealthUnits ?? healthUnitsList}
        columns={[
          { key: "name", header: "Nome Unidade" },
          { key: "number", header: "Número" },
          { key: "street", header: "Rua" },
          { key: "city", header: "Cidade" },
          { key: "state", header: "Estado" },
        ]}
        getRowId={(row) => row.id}
        showActions
        onEdit={(u) => handleSelectPatient(u.id)}
        onDelete={(u) => handleDeleteHealth(u.id)}
        onView={(u) => router.push(`/health-unit/${u.id}`)}
        pageSize={5}
        autoHeight
      />

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedHealthUnit(null);
        }}
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <HealthUnitForm
            onSubmit={async (data) => {
              try {
                if (selectedHealthUnit) {
                  await updateHealthUnit(
                    selectedHealthUnit.id,
                    data as HealthUnit,
                    token
                  );
                  toast.success("Unidade de saúde atualizada com sucesso!");
                } else {
                  await createHealthUnit(data as HealthUnit, token);
                  toast.success("Unidade de saúde criada com sucesso!");
                }
                setIsModalOpen(false);
                await loadHealth();
              } catch (error) {
                console.error("Failed to create health unit:", error);
                toast.error("Erro ao salvar unidade de saúde");
              }
            }}
            initialValues={selectedHealthUnit || undefined}
            submitLabel={
              selectedHealthUnit
                ? "Atualizar Unidade de Saúde"
                : "Criar Unidade de Saúde"
            }
          />
        </Box>
      </Modal>
    </Box>
  );
}
