import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { TriangleNodeData } from "@/store/useCanvasStore";
import React from "react";
import { useUIStore } from "@/store/useUIStore";

export type TriangleNodeType = Node<TriangleNodeData, "triangleNode">;

// We use the NodeProps generic to get perfect autocomplete for our specific data
export function TriangleNode({ data, selected, id }: NodeProps<TriangleNodeType>) {
  const setTab = useUIStore((s) => s.setLeftTab);
  const handleDoubleClick: React.MouseEventHandler = () => {
    setTab("Data");
  };
  const handleClick: React.MouseEventHandler = () => {
    if (!data.isUploaded) setTab("Data");
  };
  return (
    <>
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`relative min-w-55 rounded-lg border bg-[#1a1a1a] p-4 text-white shadow-xl transition-colors cursor-pointer ${
        selected ? "border-teal-500" : "border-slate-700"
      }`}
    >
      {/* 1. Header & Status */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Triangle Data
        </span>
        {data.isUploaded ? (
          <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/30">
            READY
          </span>
        ) : (
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/30">
            EMPTY
          </span>
        )}
      </div>

      {/* 2. Main Content (Filename) */}
      <div className="text-sm font-medium">
        {data.fileName || "Drop CSV here..."}
      </div>

      {/* 3. Metadata (Only shows if data is parsed) */}
      {data.metadata && (
        <div className="mt-4 flex flex-col gap-1.5 border-t border-slate-700 pt-3 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Origin Years:</span>
            <span className="text-slate-200">{data.metadata.originYears}</span>
          </div>
          <div className="flex justify-between">
            <span>Dev Periods:</span>
            <span className="text-slate-200">{data.metadata.devPeriods}</span>
          </div>
        </div>
      )}

      {/* 4. The Output Port (Source Handle) */}
      <Handle
        type="source" // "source" means data flows OUT of this node
        position={Position.Right}
        className="h-3 w-3 border-2 border-[#1a1a1a] bg-teal-500"
      />
    </div>
    <span className="text-xs text-muted-foreground dark:text-muted-foreground/50">{`#${id}`}</span>
</>
  );
}
