import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
  Tooltip,
  Menu,
  MenuItem,
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
  render?: (params: GridRenderCellParams<T, unknown>) => React.ReactNode;
};

export type GenericTableProps<T> = {
  rows: T[];
  columns: ColumnConfig<T>[];
  getRowId?: (row: T) => GridRowId;
  showActions?: boolean;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void | Promise<void>;
  onEvaluations?: (row: T) => void;
  onTests?: (row: T) => void;
  onQuestionnaires?: (row: T) => void;
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

type ActionsCellProps<T> = {
  row: T;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onTests?: (row: T) => void;
  onQuestionnaires?: (row: T) => void;
};

const createLoadingOverlay = (columnCount: number, rowCount: number) =>
  function LoadingOverlayWrapper() {
    return (
      <LoadingSkeletonOverlay columnCount={columnCount} rowCount={rowCount} />
    );
  };

function ActionsCell<T>({
  row,
  onEdit,
  onDelete,
  onTests,
  onQuestionnaires,
}: ActionsCellProps<T>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const hasTests = !!onTests;
  const hasQuestionnaires = !!onQuestionnaires;

  const handleEvalClick = (event: React.MouseEvent<HTMLElement>) => {
    if (hasTests && !hasQuestionnaires) {
      onTests?.(row);
      return;
    }
    if (!hasTests && hasQuestionnaires) {
      onQuestionnaires?.(row);
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const stopRowClick =
    (handler: () => void) => (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      handler();
    };

  return (
    <Stack direction="row" spacing={0.5} justifyContent="center">
      {(hasTests || hasQuestionnaires) && (
        <>
          <Tooltip title="Avaliações">
            <IconButton size="small" onClick={stopRowClick(handleEvalClick)}>
              <AssignmentIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {hasTests && (
              <MenuItem
                onClick={() => {
                  handleClose();
                  onTests?.(row);
                }}
              >
                Testes
              </MenuItem>
            )}
            {hasQuestionnaires && (
              <MenuItem
                onClick={() => {
                  handleClose();
                  onQuestionnaires?.(row);
                }}
              >
                Questionários
              </MenuItem>
            )}
          </Menu>
        </>
      )}

      {onEdit && (
        <Tooltip title="Editar">
          <IconButton size="small" onClick={stopRowClick(() => onEdit(row))}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip title="Excluir">
          <IconButton
            size="small"
            color="error"
            onClick={stopRowClick(() => onDelete(row))}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}

function humanizeKey(k: string) {
  return k
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

function actionsColumn<T>(opts: {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onTests?: (row: T) => void;
  onQuestionnaires?: (row: T) => void;
}): GridColDef<T> {
  const { onEdit, onDelete, onTests, onQuestionnaires } = opts;

  return {
    field: "__actions__",
    headerName: "Ações",
    sortable: false,
    filterable: false,
    width: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <ActionsCell
        row={params.row}
        onEdit={onEdit}
        onDelete={onDelete}
        onTests={onTests}
        onQuestionnaires={onQuestionnaires}
      />
    ),
  };
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
      base.valueGetter = (value, row: T) => {
        const rowData = row || (value as unknown)?.row;

        if (!rowData) return "";

        return c.valueGetter!(rowData);
      };
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
    onTests,
    onQuestionnaires,
    pageSize = 10,
    checkboxSelection,
    autoHeight = true,
    loading,
    density = "compact",
    toolbar,
    rowHref,
    paginationModel,
    setPaginationModel,
    skeletonRowCount = DEFAULT_SKELETON_ROWS,
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
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

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
    if (
      showActions &&
      (onView || onEdit || onDelete || onTests || onQuestionnaires)
    ) {
      cols.push(
        actionsColumn<T>({
          onEdit,
          onDelete: onDelete ? handleDeleteRequest : undefined,
          onTests: onTests,
          onQuestionnaires: onQuestionnaires,
        })
      );
    }
    return cols;
  }, [
    columns,
    showActions,
    onView,
    onEdit,
    onDelete,
    handleDeleteRequest,
    onTests,
    onQuestionnaires,
  ]);

  const resolvedGetRowId = React.useMemo(() => {
    if (getRowId) return getRowId;
    return (row: T & { id?: GridRowId }): GridRowId => {
      if (row.id != null) return row.id;
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

  const handleRowClick = React.useCallback(
    (params: GridRowParams<T>) => {
      if (!onView) return;
      onView(params.row);
    },
    [onView]
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

  const LoadingOverlaySlot = React.useMemo(
    () => createLoadingOverlay(gridColumns.length, skeletonRowCount),
    [gridColumns.length, skeletonRowCount]
  );

  if (!isMounted) {
    return (
      <Box>
        {toolbar && <Box sx={{ mb: 1 }}>{toolbar}</Box>}
        <LoadingSkeletonOverlay
          columnCount={gridColumns.length}
          rowCount={skeletonRowCount}
        />
      </Box>
    );
  }

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
        onRowClick={onView ? handleRowClick : undefined}
        sx={{
          ...((rowHref || onView) && {
            "& .MuiDataGrid-row": { cursor: "pointer" },
          }),
        }}
        slots={{
          loadingOverlay: LoadingOverlaySlot,
          noRowsOverlay: EmptyStateOverlay,
        }}
        paginationMode="server"
        rowCount={props.totalRows ?? (rows?.length || 0)}
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
