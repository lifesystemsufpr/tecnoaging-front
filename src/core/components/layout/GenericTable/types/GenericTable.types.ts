import { GridRowId, GridRenderCellParams } from "@mui/x-data-grid";
import { PageSizeOption } from "@/core/enums/page-size-options";

export type KeyOf<T> = Extract<keyof T, string>;

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
  deleteConfirmMessage?: React.ReactNode | ((row: T) => React.ReactNode);
  deleteConfirmConfirmLabel?: string;
  deleteConfirmCancelLabel?: string;
  deleteConfirmLoadingLabel?: string;
  rowHref?: (row: T) => string;
  totalRows?: number;
  paginationModel?: { pageSize: PageSizeOption; page: number };
  setPaginationModel?: (model: {
    pageSize: PageSizeOption;
    page: number;
  }) => void;
};
