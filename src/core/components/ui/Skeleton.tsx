import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/core/utils/index";

const skeletonVariants = cva("animate-pulse bg-muted", {
  variants: {
    variant: {
      rectangular: "rounded-none",
      rounded: "rounded-lg",
      circular: "rounded-full",
      text: "rounded-md",
    },
    animation: {
      pulse: "animate-pulse",
      wave: "animate-none skeleton-wave",
      none: "animate-none",
    },
  },
  defaultVariants: {
    variant: "rounded",
    animation: "pulse",
  },
});

export interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof skeletonVariants> {
  as?: React.ElementType;
  w?: React.CSSProperties["width"];
  h?: React.CSSProperties["height"];
}

const toUnit = (value: string | number | undefined) => {
  if (typeof value === "number") return `${value}px`;
  return value;
};

export const Skeleton = React.forwardRef<HTMLElement, SkeletonProps>(
  ({ as, variant, animation, w, h, className, style, ...props }, ref) => {
    const Component = as ?? "div";

    const computedStyle: React.CSSProperties = {
      ...style,
      ...(w !== undefined && { width: toUnit(w) }),
      ...(h !== undefined && { height: toUnit(h) }),
    };

    return (
      <Component
        ref={ref}
        aria-hidden="true"
        className={cn(skeletonVariants({ variant, animation }), className)}
        style={computedStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
