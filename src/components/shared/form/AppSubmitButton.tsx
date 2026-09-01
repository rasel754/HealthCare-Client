import React from "react";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { VariantProps } from "class-variance-authority";

type AppSubmitButtonProps = {
  isPending: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
};

const AppSubmitButton = ({
  isPending,
  children,
  pendingLabel,
  className,
  disabled = false,
  variant = "default",
  size = "default",
}: AppSubmitButtonProps) => {
  const isDisabled = disabled || isPending;

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={isDisabled}
      className={cn("w-full font-medium transition-all shadow-xs cursor-pointer", className)}
    >
      {isPending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
          <span>{pendingLabel || "Submitting..."}</span>
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default AppSubmitButton;