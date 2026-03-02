"use client";
import {
  MousePointer2,
  Frame,
  Triangle,
  TrendingUp,
  Table,
  BarChart2,
  Workflow,
  GitBranch,
  Type,
  MessageSquare,
  Code2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ToolbarButton } from "./control-button";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useState } from "react";

// interface ControlbarProps {
//   activeTool: string;
//   onToolChange: (tool: string) => void;
// }

export default function Controls() {
  const [activeTool, onToolChange] = useState("select");
  const { pendingNodeType, setPendingNode } = useCanvasStore();
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-0.5 bg-background/95 backdrop-blur border rounded-xl shadow-xl px-2 py-1.5">
        <ToolbarButton
          icon={<MousePointer2 className="h-4 w-4" />}
          label="Select (V)"
          active={pendingNodeType === null}
          onClick={() => setPendingNode(null)}
        />
        {/* <ToolbarButton
          icon={<Frame className="h-4 w-4" />}
          label="Frame (F)"
          active={activeTool === "frame"}
          onClick={() => onToolChange("frame")}
        /> */}

        <Separator orientation="vertical" className="h-5 my-auto mx-1" />

        <ToolbarButton
          icon={<Triangle className="h-4 w-4" />}
          label="Loss Triangle"
          active={pendingNodeType === "triangleNode"}
          onClick={() => {
            setPendingNode('triangleNode')
          }}
        />
        {/* <ToolbarButton
          icon={<TrendingUp className="h-4 w-4" />}
          label="Development Factors"
          active={activeTool === "ldf"}
          onClick={() => onToolChange("ldf")}
        /> */}
        {/* <ToolbarButton
          icon={<Table className="h-4 w-4" />}
          label="Data Table"
          active={activeTool === "table"}
          onClick={() => onToolChange("table")}
        /> */}
        {/* <ToolbarButton
          icon={<BarChart2 className="h-4 w-4" />}
          label="Chart"
          active={activeTool === "chart"}
          onClick={() => onToolChange("chart")}
        /> */}
        {/* <ToolbarButton
          icon={<Workflow className="h-4 w-4" />}
          label="Method Node"
          active={activeTool === "method"}
          onClick={() => onToolChange("method")}
        /> */}

        <Separator orientation="vertical" className="h-5 my-auto mx-1" />

        {/* <ToolbarButton
          icon={<GitBranch className="h-4 w-4" />}
          label="Connector"
          active={activeTool === "connector"}
          onClick={() => onToolChange("connector")}
        /> */}
        {/* <ToolbarButton
          icon={<Type className="h-4 w-4" />}
          label="Text (T)"
          active={activeTool === "text"}
          onClick={() => onToolChange("text")}
        /> */}
        <ToolbarButton
          icon={<MessageSquare className="h-4 w-4" />}
          label="Comment (C)"
          active={activeTool === "comment"}
          onClick={() => onToolChange("comment")}
        />

        <Separator orientation="vertical" className="h-5 my-auto mx-1" />

        {/* <ToolbarButton
          icon={<Code2 className="h-4 w-4" />}
          label="Formula Editor"
          active={activeTool === "formula"}
          onClick={() => onToolChange("formula")}
        /> */}
      </div>
    </div>
  );
}
