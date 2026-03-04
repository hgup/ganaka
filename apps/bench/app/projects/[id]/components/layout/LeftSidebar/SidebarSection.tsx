import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import clsx from "clsx";

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string
  defaultOpen?: boolean;
  action?: React.ReactNode;
}

export function SidebarSection({
  title,
  children,
  className,
  defaultOpen = true,
  action,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={clsx(className)}>
      <div className="flex items-center justify-between px-3 py-1.5">
        <CollapsibleTrigger className="flex items-center gap-1 text-xs font-semibold hover:text-foreground transition-colors">
          {open ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          {title}
        </CollapsibleTrigger>
        {action}
      </div>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
