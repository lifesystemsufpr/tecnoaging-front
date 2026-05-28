"use client";
import { useState } from "react";
import { PencilIcon, Trash2 } from "lucide-react";

import { useHealthUnitCrudContext } from "../contexts/HealthUnitCrudContext";
import { useListHealthUnits } from "../hooks/health-unit/useListHealthUnits";

import {
  Table,
  Box,
  Button,
  createColumn,
  type TableColumnDef,
  type FilterState,
} from "@/core/components/ui";
import { HealthUnit } from "../types";
import { useRouter } from "next/navigation";

import ROUTES from "@/core/config/client.routes";

export default function HealthUnitTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<FilterState>({});
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(undefined);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const router = useRouter();

  const { openEditModal, openDeleteDialog } = useHealthUnitCrudContext();

  const { data, isLoading } = useListHealthUnits({
    pageSize: pageSize,
    page: page,
    filters: filters,
    sortDirection: sortDirection,
    sortField: sortField,
  });

  const columnsConfig: TableColumnDef<HealthUnit>[] = [
    createColumn({
      field: "name",
      header: "Nome Unidade",
      render: (_, row) => row.name,
      filterable: true,
      sortable: true,
    }),
    createColumn({
      field: "street",
      header: "Rua",
      render: (_, row) => row.street,
      sortable: true,
    }),
    createColumn({
      field: "city",
      header: "Cidade",
      render: (_, row) => row.city,
      sortable: true,
    }),
    createColumn({
      field: "state",
      header: "Estado",
      render: (_, row) => row.state,
      sortable: true,
    }),
  ];

  if (isLoading) {
    return <div>Carregando unidades...</div>;
  }

  return (
    <Box>
      <Table.Root<HealthUnit>
        columns={columnsConfig}
        data={data.data ?? []}
        serverSide={{
          total: data.meta.total || 0,
          page: page,
          pageSize: pageSize,
          filters: filters,
          sort: {
            direction: sortDirection,
            field: sortField,
          },
          onPageChange: (newPage) => setPage(newPage),
          onPageSizeChange: (newSize) => {
            setPageSize(newSize);
            setPage(1);
          },
          onFilterChange: (field, value) => {
            setPage(1);
            setFilters((prev) => ({ ...prev, [field]: value }));
          },
          onSortChange: (sort) => {
            setPage(1);
            setSortField(sort.field);
            setSortDirection(sort.direction);
          },
        }}
      >
        <Table.Header showActionsColumn />
        <Table.Body<HealthUnit>
          emptyMessage="Nenhuma unidade encontrada"
          onRowClick={(row) =>
            router.push(ROUTES.INSTITUTIONS.HEALTH_UNITS.DETAIL(row.id))
          }
          renderActions={(row) => (
            <Box display="flex" gap={4} justify="center">
              <Button
                variant="outline"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  openEditModal(row);
                }}
                tooltip="Editar"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                tooltip="Excluir"
                onClick={(event) => {
                  event.stopPropagation();
                  openDeleteDialog(row);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Box>
          )}
        />
        <Table.Pagination />
      </Table.Root>
    </Box>
  );
}
