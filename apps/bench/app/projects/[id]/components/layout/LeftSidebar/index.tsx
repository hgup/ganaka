"use client";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarSection } from "./SidebarSection";
import { LayerRow } from "./LayerItem";
import { DATA, MODELS } from "../../constants";
import { useState } from "react";

export function LeftSidebar() {
  const [activeTab, onTabChange] = useState("nodes");
  return (
    <aside className="w-56 border-r flex flex-col bg-background shrink-0">
      <div className="flex border-b">
        {["Nodes", "Data"].map((t) => (
          <button
            key={t}
            className="flex-1 py-2 text-xs font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent data-[active=true]:border-primary data-[active=true]:text-foreground transition-colors"
            data-active={t.toLowerCase() === activeTab}
            onClick={() => onTabChange(t.toLowerCase())}
          >
            {t}
          </button>
        ))}
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 m-0.5">
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === "nodes" && (
          <div className="py-1">
            <Scope />

            <Separator className="my-1" />

            <ModalTree />

            <Separator className="my-1" />

            <DataCan />
          </div>
        )}
        {activeTab === "data" && <Data />}
      </ScrollArea>
    </aside>
  );
}

function Data() {
  return <div className="px-3 py-4 text-xs text-muted-foreground text-center">
    Upload Data to get started.
  </div>;
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
