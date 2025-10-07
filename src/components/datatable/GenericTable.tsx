import * as React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowParams,
} from "@mui/x-data-grid";
import {
  IconButton,
  Stack,
  Box,
  Skeleton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  PageSizeOption,
  pageSizeOptions,
} from "@/types/enums/page-size-options";

type KeyOf<T> = Extract<keyof T, string>;

export type ColumnConfig<T> = {
  key: KeyOf<T>;
  header?: string;
  width?: number;
  flex?: number;
  valueGetter?: (row: T) => unknown;
  valueFormatter?: (value: unknown, row: T) => React.ReactNode;
  render?: (params: GridRenderCellParams<T, any>) => React.ReactNode;
};

export type GenericTableProps<T> = {
  rows: T[];
  columns: ColumnConfig<T>[];
  getRowId?: (row: T) => GridRowId;
  showActions?: boolean;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void | Promise<void>;
  pageSize?: number;
  checkboxSelection?: boolean;
  autoHeight?: boolean;
  loading?: boolean;
  density?: "compact" | "standard" | "comfortable";
  toolbar?: React.ReactNode;
  skeletonRowCount?: number;
  noRowsLabel?: string;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?:
    | React.ReactNode
    | ((row: T) => React.ReactNode | string);
  deleteConfirmConfirmLabel?: string;
  deleteConfirmCancelLabel?: string;
  deleteConfirmLoadingLabel?: string;
  /** Se fornecido, habilita cursor de link e abre o href no duplo clique */
  rowHref?: (row: T) => string;
  totalRows?: number;
  paginationModel?: { pageSize: PageSizeOption; page: number };
  setPaginationModel?: (model: {
    pageSize: PageSizeOption;
    page: number;
  }) => void;
};

function humanizeKey(k: string) {
  return k
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

function actionsColumn<T>(opts: {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}): GridColDef<T> {
  const { onView, onEdit, onDelete } = opts;
  return {
    field: "__actions__",
    headerName: "Ações",
    sortable: false,
    filterable: false,
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ width: "100%", justifyContent: "center" }}
      >
        {onView && (
          <IconButton
            size="small"
            aria-label="Visualizar"
            onClick={() => onView(params.row)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        )}
        {onEdit && (
          <IconButton
            size="small"
            aria-label="Editar"
            onClick={() => onEdit(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
        {onDelete && (
          <IconButton
            size="small"
            color="error"
            aria-label="Excluir"
            onClick={() => onDelete(params.row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
    ),
  } as GridColDef<T>;
}

function toGridColumns<T>(specs: ColumnConfig<T>[]): GridColDef<T>[] {
  return specs.map((c) => {
    const base: GridColDef<T> = {
      field: c.key as string,
      headerName: c.header ?? humanizeKey(c.key as string),
      width: c.width,
      flex: c.flex ?? (c.width ? undefined : 1),
    };

    if (c.render) base.renderCell = c.render;
    if (c.valueGetter) {
      base.valueGetter = (params) => c.valueGetter!((params as { row: T }).row);
    }
    if (c.valueFormatter) {
      base.valueFormatter = (params) =>
        c.valueFormatter!(params.value, params.row);
    }

    return base;
  });
}

export const colsFromKeys = <T, K extends KeyOf<T>>(
  keys: readonly K[],
  defaults?: Pick<ColumnConfig<T>, "width" | "flex">
): ColumnConfig<T>[] => keys.map((k) => ({ key: k, ...defaults }));

const DEFAULT_SKELETON_ROWS = 6;
const DEFAULT_NO_ROWS_LABEL = "Nenhum registro encontrado";
const DEFAULT_DELETE_TITLE = "Confirmar exclusão";
const DEFAULT_DELETE_MESSAGE =
  "Tem certeza de que deseja excluir este registro?";
const DEFAULT_DELETE_CONFIRM_LABEL = "Excluir";
const DEFAULT_DELETE_CANCEL_LABEL = "Cancelar";
const DEFAULT_DELETE_LOADING_LABEL = "Excluindo...";

const LoadingSkeletonOverlay = React.memo(
  ({
    columnCount = 1,
    rowCount = DEFAULT_SKELETON_ROWS,
    ...other
  }: {
    columnCount?: number;
    rowCount?: number;
  }) => {
    const safeColumnCount = Math.max(1, columnCount);
    const safeRowCount = Math.max(1, rowCount);

    return (
      <Box
        {...other}
        sx={{
          width: "100%",
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {Array.from({ length: safeRowCount }).map((_, rowIdx) => (
          <Box
            key={rowIdx}
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${safeColumnCount}, minmax(80px, 1fr))`,
              gap: 1,
            }}
          >
            {Array.from({ length: safeColumnCount }).map((__, colIdx) => (
              <Skeleton key={colIdx} variant="rounded" height={28} />
            ))}
          </Box>
        ))}
      </Box>
    );
  }
);

LoadingSkeletonOverlay.displayName = "LoadingSkeletonOverlay";

const EmptyStateOverlay = React.memo(
  ({ children, ...other }: { children?: React.ReactNode }) => (
    <Box
      {...other}
      role="presentation"
      sx={{
        width: "100%",
        py: 4,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {children || DEFAULT_NO_ROWS_LABEL}
      </Typography>
    </Box>
  )
);

EmptyStateOverlay.displayName = "EmptyStateOverlay";

export function GenericTable<T>(props: GenericTableProps<T>) {
  const {
    rows,
    columns,
    getRowId,
    showActions,
    onView,
    onEdit,
    onDelete,
    pageSize = 10,
    checkboxSelection,
    autoHeight = true,
    loading,
    density = "compact",
    toolbar,
    rowHref,
    totalRows,
    paginationModel,
    setPaginationModel,
    skeletonRowCount = DEFAULT_SKELETON_ROWS,
    noRowsLabel = DEFAULT_NO_ROWS_LABEL,
    deleteConfirmTitle = DEFAULT_DELETE_TITLE,
    deleteConfirmMessage = DEFAULT_DELETE_MESSAGE,
    deleteConfirmConfirmLabel = DEFAULT_DELETE_CONFIRM_LABEL,
    deleteConfirmCancelLabel = DEFAULT_DELETE_CANCEL_LABEL,
    deleteConfirmLoadingLabel = DEFAULT_DELETE_LOADING_LABEL,
  } = props;

  const [rowPendingDeletion, setRowPendingDeletion] = React.useState<T | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteDialogLoading, setDeleteDialogLoading] = React.useState(false);

  const handleDeleteRequest = React.useCallback(
    (row: T) => {
      if (!onDelete) return;
      setRowPendingDeletion(row);
      setDeleteDialogLoading(false);
      setDeleteDialogOpen(true);
    },
    [onDelete]
  );

  const gridColumns = React.useMemo(() => {
    const cols = toGridColumns(columns);
    if (showActions && (onView || onEdit || onDelete)) {
      cols.push(
        actionsColumn<T>({
          onView,
          onEdit,
          onDelete: onDelete ? handleDeleteRequest : undefined,
        })
      );
    }
    return cols;
  }, [columns, showActions, onView, onEdit, onDelete, handleDeleteRequest]);

  const resolvedGetRowId = React.useMemo(() => {
    if (getRowId) return getRowId;
    return (row: any): GridRowId => {
      if (row && row.id != null) return row.id;
      console.warn(
        `[GenericTable] A prop 'getRowId' não foi fornecida e a propriedade 'id' não foi encontrada na linha. Usando JSON.stringify como fallback, o que pode causar problemas de performance.`,
        { row }
      );
      return JSON.stringify(row);
    };
  }, [getRowId]);

  const memoInitialState = React.useMemo(
    () => ({ pagination: { paginationModel: { pageSize } } }),
    [pageSize]
  );

  const handleRowDoubleClick = React.useCallback(
    (params: GridRowParams<T>) => {
      if (!rowHref) return;
      const href = rowHref(params.row);
      if (href) window.location.href = href; // simples e eficaz
    },
    [rowHref]
  );

  const handleCloseDeleteDialog = React.useCallback(() => {
    if (deleteDialogLoading) return;
    setDeleteDialogOpen(false);
    setRowPendingDeletion(null);
  }, [deleteDialogLoading]);

  const handleConfirmDelete = React.useCallback(async () => {
    if (!onDelete || !rowPendingDeletion) return;
    try {
      setDeleteDialogLoading(true);
      await Promise.resolve(onDelete(rowPendingDeletion));
      setDeleteDialogOpen(false);
      setRowPendingDeletion(null);
    } catch (error) {
      console.error("[GenericTable] Erro ao excluir linha:", error);
    } finally {
      setDeleteDialogLoading(false);
    }
  }, [onDelete, rowPendingDeletion]);

  const deleteDialogMessageContent = React.useMemo<React.ReactNode>(() => {
    if (typeof deleteConfirmMessage === "function") {
      return rowPendingDeletion
        ? deleteConfirmMessage(rowPendingDeletion)
        : DEFAULT_DELETE_MESSAGE;
    }
    return deleteConfirmMessage;
  }, [deleteConfirmMessage, rowPendingDeletion]);

  return (
    <Box>
      {toolbar && (
        <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
          {toolbar}
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={gridColumns}
        getRowId={resolvedGetRowId}
        autoHeight={autoHeight}
        disableRowSelectionOnClick
        checkboxSelection={checkboxSelection}
        pageSizeOptions={pageSizeOptions}
        initialState={memoInitialState}
        loading={loading}
        density={density}
        onRowDoubleClick={rowHref ? handleRowDoubleClick : undefined}
        sx={{
          ...(rowHref && {
            "& .MuiDataGrid-row": { cursor: "pointer" },
          }),
        }}
        slots={{
          loadingOverlay: LoadingSkeletonOverlay,
          noRowsOverlay: EmptyStateOverlay,
        }}
        slotProps={{
          loadingOverlay: {
            columnCount: gridColumns.length,
            rowCount: skeletonRowCount,
          } as any,
          noRowsOverlay: {
            children: noRowsLabel,
          },
        }}
        paginationMode="server"
        rowCount={props.totalRows ?? rows.length}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      {onDelete && (
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>{deleteConfirmTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText component="div">
              {deleteDialogMessageContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDeleteDialog}
              disabled={deleteDialogLoading}
            >
              {deleteConfirmCancelLabel}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              disabled={deleteDialogLoading}
              autoFocus
            >
              {deleteDialogLoading
                ? deleteConfirmLoadingLabel
                : deleteConfirmConfirmLabel}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
