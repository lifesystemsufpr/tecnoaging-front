import * as React from "react";
import { IconButton, Stack, Tooltip, Menu, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";

type ActionsCellProps<T> = {
  row: T;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onTests?: (row: T) => void;
  onQuestionnaires?: (row: T) => void;
};

export function ActionsCell<T>({
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
    event.stopPropagation();
    if (hasTests && !hasQuestionnaires) return onTests?.(row);
    if (!hasTests && hasQuestionnaires) return onQuestionnaires?.(row);
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
            <IconButton size="small" onClick={handleEvalClick}>
              <AssignmentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={(e) => e.stopPropagation()}
          >
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
