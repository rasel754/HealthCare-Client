"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import { ClinicalTableSkeleton } from "./ClinicalSkeleton";

export interface ColumnConfig<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  loadingMessage = "Retrieving clinical records...",
  emptyTitle = "No Data Available",
  emptyDescription = "There are no records to display at this time.",
  className = "",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <ClinicalTableSkeleton
        rows={5}
        columns={columns.length || 5}
        message={loadingMessage}
      />
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
        <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="text-base font-bold text-foreground">{emptyTitle}</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-3xl border border-border bg-card shadow-xs ${className}`}>
      <table className="w-full text-left text-xs">
        <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`p-4 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {data.map((item, rowIdx) => (
            <tr key={keyExtractor(item, rowIdx)} className="hover:bg-accent/40 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={`p-4 align-middle text-foreground ${col.className || ""}`}>
                  {col.render
                    ? col.render(item, rowIdx)
                    : col.accessorKey
                    ? String(item[col.accessorKey] ?? "")
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
