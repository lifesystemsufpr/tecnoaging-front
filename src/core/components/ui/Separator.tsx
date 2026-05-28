import { cn } from "@/core/utils/index";

export function Separator({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}
