"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import MethodSettings from "./Specification";
// import { useState } from "react";
import ExportSection from "./Export";

export function RightSidebar() {
  // const [activeTab, onTabChange] = useState("specs");

  return (
    <aside className="w-60 border-l flex flex-col bg-background shrink-0">
      {/* Design / Properties tabs */}
      {/* <div className="flex border-b">
        {["Specs", "Inspector"].map((t) => (
          <button
            key={t}
            className="flex-1 py-2 text-xs font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent data-[active=true]:border-primary data-[active=true]:text-foreground transition-colors"
            data-active={t.toLowerCase() === activeTab}
            onClick={() => onTabChange(t.toLowerCase())}
          >
            {t}
          </button>
        ))}
      </div> */}

      <ScrollArea className="flex-1">
        <MethodSettings />
      </ScrollArea>
      <ExportSection />
    </aside>
  );
}
