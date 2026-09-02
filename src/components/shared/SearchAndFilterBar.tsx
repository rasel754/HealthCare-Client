"use client";

import React from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  value: string;
  placeholder: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export interface SearchAndFilterBarProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  filters = [],
  onClearFilters,
  hasActiveFilters,
  className = "",
}) => {
  const isActive =
    hasActiveFilters !== undefined
      ? hasActiveFilters
      : Boolean(searchTerm || filters.some((f) => f.value !== ""));

  return (
    <div className={`bg-card text-card-foreground p-4 sm:p-5 rounded-3xl border border-border shadow-xs space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background text-foreground border-input text-xs"
            />
          </div>
        )}

        {/* Dynamic Filter Select Dropdowns */}
        {filters.map((filter) => (
          <div key={filter.id}>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full h-10 px-3 bg-background border border-input rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{filter.placeholder}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Clear Filters Bar */}
      {isActive && onClearFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
          <span className="text-muted-foreground font-medium">Active filters applied</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1.5 rounded-xl font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilterBar;
