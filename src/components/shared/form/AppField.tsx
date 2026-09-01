
import type { AnyFieldApi } from "@tanstack/react-form";
import React from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    if ("message" in error && typeof (error as { message: unknown }).message === "string") {
      return (error as { message: string }).message;
    }
  }

  return String(error);
};

export type AppFieldProps = {
  field: AnyFieldApi;
  label?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "textarea";
  placeholder?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  rows?: number;
};

const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  append,
  prepend,
  className,
  inputClassName,
  disabled = false,
  required = false,
  helperText,
  rows = 3,
}: AppFieldProps) => {
  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null;

  const hasError = firstError !== null;

  return (
    <div className={cn("space-y-1.5 w-full text-left", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label
            htmlFor={field.name}
            className={cn(
              "text-xs font-semibold text-foreground/80 tracking-wide",
              hasError && "text-destructive font-medium"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
        </div>
      )}

      <div className="relative flex items-center">
        {prepend && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none z-10">
            {prepend}
          </div>
        )}

        {type === "textarea" ? (
          <Textarea
            id={field.name}
            name={field.name}
            value={field.state.value ?? ""}
            placeholder={placeholder}
            rows={rows}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.name}-error` : undefined}
            className={cn(
              "w-full bg-background text-foreground transition-all duration-150",
              prepend && "pl-9",
              append && "pr-9",
              hasError
                ? "border-destructive focus-visible:ring-destructive/30"
                : "border-input hover:border-primary/50 focus-visible:ring-primary/20",
              inputClassName
            )}
          />
        ) : (
          <Input
            id={field.name}
            name={field.name}
            type={type}
            value={field.state.value ?? ""}
            placeholder={placeholder}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.name}-error` : undefined}
            className={cn(
              "w-full bg-background text-foreground transition-all duration-150 h-10",
              prepend && "pl-9",
              append && "pr-10",
              hasError
                ? "border-destructive focus-visible:ring-destructive/30"
                : "border-input hover:border-primary/50 focus-visible:ring-primary/20",
              inputClassName
            )}
          />
        )}

        {append && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 z-10">
            {append}
          </div>
        )}
      </div>

      {helperText && !hasError && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {helperText}
        </p>
      )}

      {hasError && (
        <p
          id={`${field.name}-error`}
          role="alert"
          className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {firstError}
        </p>
      )}
    </div>
  );
};

export default AppField;