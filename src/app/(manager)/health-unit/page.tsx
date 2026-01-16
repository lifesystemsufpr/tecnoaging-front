"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Button, Modal, useMediaQuery, useTheme } from "@mui/material";
import {
  ColumnConfig,
  GenericTable,
} from "@/components/datatable/GenericTable";
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
import { SearchInput } from "@/components/form/input/SearchInput";
import { FormRoot } from "@/components/form/container/FormProvider";

export default function HealthUnitCRUDPage() {
  const [healthUnitsList, setHealthUnitsList] = useState<HealthUnit[]>([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHealthUnit, setSelectedHealthUnit] =
    useState<HealthUnit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const theme = useTheme();
  const isNotebook = useMediaQuery(theme.breakpoints.down("lg"));
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  const reloadHealth = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { data } = await fetchHealthUnits({
        access_token: token,
        name: query,
      });
      setHealthUnitsList(data);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao carregar unidades de saúde");
    } finally {
      setIsLoading(false);
    }
  }, [token, query]);

  useEffect(() => {
    if (token) {
      reloadHealth();
    }
  }, [token, reloadHealth, query]);

  const handleDeleteHealth = useCallback(
    async (id: string) => {
      try {
        await deleteHealthUnit(id, token);
        await reloadHealth();
      } catch (error) {
        console.error("Failed to delete health unit:", error);
        toast.error("Erro ao deletar unidade de saúde");
      }
    },
    [token, reloadHealth]
  );

  const handleSelectPatient = useCallback(
    (id: string) => {
      const healthUnit = healthUnitsList.find((unit) => unit.id === id) || null;
      setSelectedHealthUnit(healthUnit);
      setIsModalOpen(true);
    },
    [healthUnitsList]
  );

  const handleSearchHealth = (queryResult: string) => {
    if (!queryResult) return;
    setQuery(queryResult);
  };

  const columns: ColumnConfig<HealthUnit>[] = useMemo(
    () =>
      isNotebook
        ? [
            { key: "name", header: "Nome Unidade" },
            { key: "city", header: "Cidade" },
          ]
        : [
            { key: "name", header: "Nome Unidade" },
            { key: "number", header: "Número" },
            { key: "street", header: "Rua" },
            { key: "city", header: "Cidade" },
            { key: "state", header: "Estado" },
          ],
    [isNotebook]
  );

  return (
    <Box>
      <h1>Gerenciar Unidades de Saúde</h1>
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
          onSearch={handleSearchHealth}
          placeholder="Buscar unidade de saúde"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 0, mb: 0 }}
          onClick={() => setIsModalOpen(true)}
        >
          Adicionar Unidades de Saúde
        </Button>
      </Box>

      <GenericTable
        rows={healthUnitsList}
        columns={columns}
        getRowId={(row) => row.id}
        showActions
        onEdit={(u) => handleSelectPatient(u.id)}
        onDelete={(u) => handleDeleteHealth(u.id)}
        onView={(u) => router.push(`/health-unit/${u.id}`)}
        pageSize={5}
        autoHeight
        deleteConfirmMessage={(row) => (
          <>Tem certeza que deseja excluir {row.name}?</>
        )}
        deleteConfirmTitle="Excluir unidade de saúde"
        loading={isLoading}
      />

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedHealthUnit(null);
        }}
      >
        <FormRoot>
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
                await reloadHealth();
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
        </FormRoot>
      </Modal>
    </Box>
  );
}
