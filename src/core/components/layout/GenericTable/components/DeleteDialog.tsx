import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const DEFAULT_LABELS = {
  title: "Confirmar exclusão",
  message: "Tem certeza de que deseja excluir este registro?",
  confirm: "Excluir",
  cancel: "Cancelar",
  loading: "Excluindo...",
};

export type DeleteConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: React.ReactNode;
  labels?: {
    confirm?: string;
    cancel?: string;
    loading?: string;
  };
};

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading,
  title = DEFAULT_LABELS.title,
  message = DEFAULT_LABELS.message,
  labels,
}: DeleteConfirmDialogProps) {
  const confirmLabel = loading
    ? (labels?.loading ?? DEFAULT_LABELS.loading)
    : (labels?.confirm ?? DEFAULT_LABELS.confirm);

  const cancelLabel = labels?.cancel ?? DEFAULT_LABELS.cancel;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
