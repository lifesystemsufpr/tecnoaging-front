"use client";
import { useState } from "react";
import { PencilIcon, Trash2 } from "lucide-react";

import { useParticipantCrudContext } from "../contexts/ParticipantCrudContext";
import { useListParticipants } from "../hooks/useListParticipants";

import {
  Table,
  Box,
  Button,
  createColumn,
  type TableColumnDef,
  type FilterState,
} from "@/core/components/ui";
import { Participant } from "@/core/types";
import { formatCPF, formatPhoneBR } from "@/core/utils";
import { useRouter } from "next/navigation";
import ROUTES from "@/core/config/client.routes";
import { useSession } from "next-auth/react";
import { SystemRoles } from "@/core/enums";

export default function ParticipantTable() {
  const { data: user } = useSession();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<FilterState>({});
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(undefined);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const router = useRouter();

  const { openEditModal, openDeleteDialog } = useParticipantCrudContext();

  const { data, isLoading } = useListParticipants({
    pageSize: pageSize,
    page: page,
    filters: filters,
    sortDirection: sortDirection,
    sortField: sortField,
  });

  const columnsConfig: TableColumnDef<Participant>[] = [
    createColumn({
      field: "fullName",
      header: "Nome Completo",
      render: (_, row) => row.fullName,
      filterable: true,
      sortable: true,
    }),
    createColumn({
      field: "cpf",
      header: "CPF",
      render: (_, row) => formatCPF(row.cpf),
    }),
    createColumn({
      field: "phone",
      header: "Telefone",
      render: (_, row) => formatPhoneBR(row.phone),
    }),
    createColumn({
      field: "state",
      header: "Estado (UF)",
      render: (_, row) => row.state ?? "—",
    }),
    createColumn({
      field: "active",
      header: "Status",
      render: (_, row) => (row.active ? "Ativado" : "Desativado"),
    }),
  ];

  if (isLoading) {
    return <div>Carregando participantes...</div>;
  }

  const actionVisible = user?.user.role !== SystemRoles.RESEARCHER;

  return (
    <Box>
      <Table.Root<Participant>
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
        <Table.Header showActionsColumn={actionVisible} />
        <Table.Body<Participant>
          emptyMessage="Nenhum participante encontrado"
          rowClassName={(row) =>
            row.active
              ? "cursor-pointer"
              : "bg-gray-200 hover:bg-gray-200 cursor-not-allowed"
          }
          onRowClick={(row) =>
            row.active
              ? router.push(ROUTES.USERS.PARTICIPANTS.DETAIL(row.id))
              : undefined
          }
          renderActions={
            actionVisible
              ? (row) => (
                  <>
                    {row.active && (
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
                  </>
                )
              : undefined
          }
        />
        <Table.Pagination />
      </Table.Root>
    </Box>
  );
}
