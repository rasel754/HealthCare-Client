"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { FolderOpen, RotateCcw } from "lucide-react";
import { ClinicalCardGridSkeleton } from "./ClinicalSkeleton";

export interface CardGridProps<T> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  columnsClassName?: string;
  className?: string;
}

export function CardGrid<T>({
  items,
  renderCard,
  keyExtractor,
  isLoading = false,
  loadingMessage = "Retrieving clinical records...",
  emptyTitle = "No Records Found",
  emptyDescription = "No records match your criteria. Try adjusting filters or search parameters.",
  emptyIcon = <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto" />,
  onClearFilters,
  hasActiveFilters,
  columnsClassName = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  className = "",
}: CardGridProps<T>) {
  if (isLoading) {
    return (
      <ClinicalCardGridSkeleton
        count={6}
        message={loadingMessage}
        columnsClassName={columnsClassName}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
        {emptyIcon}
        <h3 className="text-base font-bold text-foreground">{emptyTitle}</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">{emptyDescription}</p>
        {hasActiveFilters && onClearFilters && (
          <Button variant="outline" onClick={onClearFilters} className="rounded-xl gap-2 text-xs mt-2">
            <RotateCcw className="h-3.5 w-3.5" /> Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid ${columnsClassName} gap-6 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={keyExtractor(item, index)}>
          {renderCard(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}

export default CardGrid;
