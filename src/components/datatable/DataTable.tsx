"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface DataTableProps {
  data: any[];
  columns: ColumnDef<any>[];
  total: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch?: (value: string) => void;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSortChange?: (field: string, direction: "asc" | "desc") => void;
  loading?: boolean;
}

export default function DataTable({
  data,
  columns,
  total,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearch,
  sortBy,
  sortDir,
  onSortChange,
  loading = false,
}: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting: sortBy ? [{ id: sortBy, desc: sortDir === "desc" }] : [],
    },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        onPageChange(newState.pageIndex);
        onPageSizeChange(newState.pageSize);
      } else {
        onPageChange(updater.pageIndex);
        onPageSizeChange(updater.pageSize);
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        const newSorting = updater([{ id: sortBy || "", desc: sortDir === "desc" }]);
        if (newSorting.length > 0 && onSortChange) {
          onSortChange(newSorting[0].id, newSorting[0].desc ? "desc" : "asc");
        }
      }
    },
    pageCount: Math.ceil(total / pageSize),
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="w-full">
      {/* Search */}
      {onSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  Carregando...
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Mostrando {pageIndex * pageSize + 1} a {Math.min((pageIndex + 1) * pageSize, total)} de {total} resultados
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-700">
            Página {pageIndex + 1} de {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
