"use client";
import { useState } from "react";
import { PencilIcon, Trash2 } from "lucide-react";
import { useListResearchers } from "../hooks/useListResearchers";
import { useResearcherCrudContext } from "../contexts/ResearcherListContext";

import {
  Table,
  Box,
  Button,
  createColumn,
  type TableColumnDef,
  type FilterState,
} from "@/core/components/ui";
import { Researcher } from "@/core/types";
import { formatCPF } from "@/core/utils";
import { useRouter } from "next/navigation";
import ROUTES from "@/core/config/client.routes";

export default function ResearcherTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<FilterState>({});
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(undefined);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const router = useRouter();

  const { openEditModal, openDeleteDialog } = useResearcherCrudContext();

  const { data, isLoading, error } = useListResearchers({
    pageSize: pageSize,
    page: page,
    filters: filters,
    sortDirection: sortDirection,
    sortField: sortField,
  });

  const columnsConfig: TableColumnDef<Researcher>[] = [
    createColumn({
      field: "fullName",
      header: "Nome Completo",
      render: (_, row) => row.fullName,
      filterable: true,
      sortable: true,
    }),
    createColumn({
      field: "email",
      header: "Email",
      render: (_, row) => row.email,
      sortable: true,
    }),
    createColumn({
      field: "cpf",
      header: "CPF",
      render: (_, row) => formatCPF(row.cpf),
    }),
    createColumn({
      field: "institutionName",
      header: "Instituição",
      render: (_, row) => row.institutionName ?? "—",
    }),
  ];

  if (isLoading) {
    return <div>Carregando pesquisadores...</div>;
  }

  return (
    <Box>
      <Table.Root<Researcher>
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
        <Table.Body<Researcher>
          emptyMessage="Nenhum pesquisador encontrado"
          onRowClick={(row) =>
            router.push(ROUTES.USERS.RESEARCHERS.DETAIL(row.id))
          }
          renderActions={(row) => (
            <Box display="flex" gap={4} justify="center">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
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
                onClick={(e) => {
                  e.stopPropagation();
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
