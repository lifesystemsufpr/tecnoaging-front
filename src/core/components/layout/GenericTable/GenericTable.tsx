import { useState, useCallback, useEffect, useMemo, ReactNode } from "react";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { pageSizeOptions } from "@/types/enums/page-size-options";

import { GenericTableProps } from "./types/GenericTable.types";
import { toGridColumns, createActionsColumn } from "./utils/columns.utils";
import { LoadingSkeletonOverlay } from "./components/LoadingOverlay";
import { EmptyStateOverlay } from "./components/EmptyOverlay";
import { DeleteConfirmDialog } from "./components/DeleteDialog";

const DEFAULT_SKELETON_ROWS = 6;

export * from "./types/GenericTable.types";

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
    deleteConfirmTitle,
    deleteConfirmMessage,
    deleteConfirmConfirmLabel,
    deleteConfirmCancelLabel,
    deleteConfirmLoadingLabel,
    totalRows,
  } = props;

  // Lógica de Estado
  const [rowPendingDeletion, setRowPendingDeletion] = useState<T | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogLoading, setDeleteDialogLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // Handlers
  const handleDeleteRequest = useCallback(
    (row: T) => {
      if (!onDelete) return;
      setRowPendingDeletion(row);
      setDeleteDialogOpen(true);
    },
    [onDelete]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!onDelete || !rowPendingDeletion) return;
    try {
      setDeleteDialogLoading(true);
      await Promise.resolve(onDelete(rowPendingDeletion));
      setDeleteDialogOpen(false);
      setRowPendingDeletion(null);
    } catch (error) {
      console.error("[GenericTable] Delete error:", error);
    } finally {
      setDeleteDialogLoading(false);
    }
  }, [onDelete, rowPendingDeletion]);

  // Memoização das Colunas
  const gridColumns = useMemo(() => {
    const cols = toGridColumns(columns);
    if (
      showActions &&
      (onView || onEdit || onDelete || onTests || onQuestionnaires)
    ) {
      cols.push(
        createActionsColumn({
          onEdit,
          onDelete: onDelete ? handleDeleteRequest : undefined,
          onTests,
          onQuestionnaires,
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

  // Helpers de Grid
  const resolvedGetRowId = useMemo(() => {
    if (getRowId) return getRowId;
    return (row: T & { id?: GridRowId }) => row.id ?? JSON.stringify(row);
  }, [getRowId]);

  const LoadingOverlaySlot = useMemo(() => {
    const GenericTableLoadingOverlay = () => (
      <LoadingSkeletonOverlay
        columnCount={gridColumns.length}
        rowCount={skeletonRowCount}
      />
    );
    GenericTableLoadingOverlay.displayName = "GenericTableLoadingOverlay";
    return GenericTableLoadingOverlay;
  }, [gridColumns.length, skeletonRowCount]);

  const resolvedDeleteMessage = useMemo<ReactNode>(() => {
    if (typeof deleteConfirmMessage === "function") {
      return rowPendingDeletion
        ? deleteConfirmMessage(rowPendingDeletion)
        : null;
    }
    return deleteConfirmMessage ?? null;
  }, [deleteConfirmMessage, rowPendingDeletion]);

  if (!isMounted) return null;

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
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        loading={loading}
        density={density}
        onRowDoubleClick={
          rowHref
            ? (params) => {
                const href = rowHref(params.row);
                if (href) window.location.href = href;
              }
            : undefined
        }
        onRowClick={onView ? (params) => onView(params.row) : undefined}
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
        rowCount={totalRows ?? (rows?.length || 0)}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      {/* Dialog extraído e simplificado */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        loading={deleteDialogLoading}
        onClose={() => !deleteDialogLoading && setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deleteConfirmTitle}
        message={resolvedDeleteMessage}
        labels={{
          confirm: deleteConfirmConfirmLabel,
          cancel: deleteConfirmCancelLabel,
          loading: deleteConfirmLoadingLabel,
        }}
      />
    </Box>
  );
}
