import { ColumnDef } from "@tanstack/react-table";

export interface ColumnConfig {
  accessorKey: string;
  title: string;
  enableSorting?: boolean;
  size?: string;
  cell?: ({ row }: { row: any }) => React.ReactNode;
}

export function generateColumns(columnConfigs: ColumnConfig[]): ColumnDef<any>[] {
  return columnConfigs.map((config) => ({
    accessorKey: config.accessorKey,
    header: config.title,
    enableSorting: config.enableSorting ?? false,
    size: config.size ? parseInt(config.size.replace('px', '')) : undefined,
    cell: config.cell,
  }));
}
