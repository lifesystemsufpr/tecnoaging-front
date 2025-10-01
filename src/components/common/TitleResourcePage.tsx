"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Box,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TitleForm from "./TitleForm";
import { useSession } from "next-auth/react";
import type { TitleEntity, TitleRequest } from "@/services/makeTitleService";

type Service = {
  list: (token?: string) => Promise<TitleEntity[]>;
  create: (payload: TitleRequest, token?: string) => Promise<void>;
  update: (id: string, payload: TitleRequest, token?: string) => Promise<void>;
  remove: (id: string, token?: string) => Promise<void>;
};

export default function TitleResourcePage({
  resourceName,
  service,
  pageSizeOptions = [5, 10, 15, 20, 50],
}: {
  resourceName: string;
  service: Service;
  pageSizeOptions?: number[];
}) {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const [rows, setRows] = useState<TitleEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "title", sort: "asc" },
  ]);
  const [search, setSearch] = useState("");

  // modal create/edit
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<TitleEntity | null>(null);

  // dialog delete
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState<TitleEntity | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await service.list(token);
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, [service, token]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((r) => r.title.toLowerCase().includes(t));
  }, [rows, search]);

  const columns = useMemo<GridColDef<TitleEntity>[]>(() => {
    const actions: GridColDef<TitleEntity> = {
      field: "actions",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<TitleEntity>) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            aria-label="Editar"
            onClick={() => {
              setEditing(params.row);
              setOpenForm(true);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            aria-label="Excluir"
            onClick={() => {
              setDeleting(params.row);
              setOpenDelete(true);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    };

    return [
      {
        field: "title",
        headerName: "Título",
        flex: 1,
        minWidth: 240,
        sortable: true,
      },
      actions,
    ];
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const submitForm = async ({ title }: { title: string }) => {
    if (editing) {
      await service.update(editing.id, { title }, token);
    } else {
      await service.create({ title }, token);
    }
    setOpenForm(false);
    await load();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await service.remove(deleting.id, token);
    setOpenDelete(false);
    setDeleting(null);
    await load();
  };

  return (
    <Box>
      {/* Toolbar */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <h1>Gerenciar {resourceName}</h1>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={2}
      >
        <TextField
          size="small"
          placeholder={`Buscar ${resourceName.toLowerCase()}s`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={handleCreate}>
          Nova {resourceName}
        </Button>
      </Stack>

      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight
          rows={filtered}
          columns={columns}
          getRowId={(r) => r.id}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={pageSizeOptions}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableColumnMenu
          density="comfortable"
        />
      </div>

      {/* Create/Edit */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editing ? `Editar ${resourceName}` : `Nova ${resourceName}`}
        </DialogTitle>
        <DialogContent dividers>
          <TitleForm
            initialTitle={editing?.title ?? ""}
            onCancel={() => setOpenForm(false)}
            onSubmit={submitForm}
            submitLabel={editing ? "Salvar alterações" : "Salvar"}
          />
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Excluir {resourceName.toLowerCase()}</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir <b>{deleting?.title}</b>?
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDelete(false)}>
            Cancelar
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
