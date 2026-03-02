import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarSection } from "../LeftSidebar/SidebarSection";
export default function MethodSettings() {
  return (
    <div className="py-2 space-y-1">
      {/* Assumptions */}
      <SidebarSection
        title="Assumptions"
        defaultOpen={false}
        action={
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        }
      >
        <div className="px-3 pb-2 space-y-1">
          {[
            { name: "loss_ratio", val: "0.65" },
            { name: "tail_factor", val: "1.04" },
            { name: "discount_rate", val: "0.035" },
          ].map((v) => (
            <div key={v.name} className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                {v.name}
              </span>
              <span className="text-xs font-mono">{v.val}</span>
            </div>
          ))}
        </div>
      </SidebarSection>

      <Separator />

      {/* Reserving Methods */}
      <SidebarSection title="Reserving Methods">
        <div className="px-3 pb-2 space-y-1">
          {[
            "Chain Ladder",
            "Bornhuetter-Ferguson",
            "Cape Cod",
            "Frequency-Severity",
          ].map((m) => (
            <div
              key={m}
              className="flex items-center justify-between py-0.5 cursor-pointer group"
            >
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {m}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </SidebarSection>

      <Separator />

    </div>
  );
}