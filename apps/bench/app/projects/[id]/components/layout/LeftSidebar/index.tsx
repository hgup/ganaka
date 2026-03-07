"use client";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarSection } from "./SidebarSection";
import { LayerRow } from "./LayerItem";
import { DATA, MODELS } from "../../constants";
import { UIState, useUIStore } from "@/store/useUIStore";
import { Data } from "./Data";
const PANES: UIState["leftSidebar"]["tab"][] = ["Nodes", "Data"];

export function LeftSidebar() {
  const activeTab = useUIStore((s) => s.leftSidebar.tab);
  const onTabChange = useUIStore((s) => s.setLeftTab);
  return (
    <aside className="w-56 border-r h-full flex flex-col bg-background shrink-0">
      <div className="flex border-b">
        {PANES.map((t) => (
          <button
            key={t}
            className="flex-1 py-2 text-xs font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent data-[active=true]:border-primary data-[active=true]:text-foreground transition-colors"
            data-active={t === activeTab}
            onClick={() => onTabChange(t)}
          >
            {t}
          </button>
        ))}
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 m-0.5">
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>

      {activeTab === "Nodes" && (
        <div className="py-1">
          <ScrollArea className="flex-1">
            <Scope />
            <Separator className="my-1" />
            <ModalTree />
            <Separator className="my-1" />
            <DataCan />
          </ScrollArea>
        </div>
      )}
      {activeTab === "Data" && <Data />}
    </aside>
  );
}

function Scope() {
  return (
    <SidebarSection
      title="Scope"
      action={
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      }
    >
      {["Monthly Grain", "Quarterly Grain", "Annual Grain"].map((p, i) => (
        <div
          key={p}
          className={`px-6 py-1 text-xs rounded-sm cursor-pointer hover:bg-accent ${
            i === 0
              ? "bg-accent text-foreground font-medium"
              : "text-muted-foreground"
          }`}
        >
          {p}
        </div>
      ))}
    </SidebarSection>
  );
}

function ModalTree() {
  return (
    <SidebarSection title="Project Tree">
      {MODELS.map((layer) => (
        //@ts-expect-error Good morning
        <LayerRow key={layer.id} layer={layer} />
      ))}
    </SidebarSection>
  );
}

function DataCan() {
  return (
    <SidebarSection title="Data Can">
      {DATA.map((layer) => (
        //@ts-expect-error Good morning
        <LayerRow key={layer.id} layer={layer} />
      ))}
    </SidebarSection>
  );
}
