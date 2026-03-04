// src/components/canvas/Nodes/MethodNode.tsx
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import {
  MethodNodeData,
  MethodType,
  useCanvasStore,
} from "@/store/useCanvasStore";
import { Card, CardContent, CardHeader } from "@ui/card";
import { RotateCcw, TrendingUp } from "lucide-react";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { Badge } from "@ui/badge";

export type MethodNodeType = Node<MethodNodeData, "methodNode">;

const METHOD_LABELS: Record<string, string> = {
  chainladder: "Chain Ladder",
  bf: "Bornhuetter–Ferguson",
  capecod: "Cape Cod",
};

const METHOD_DESCRIPTIONS: Record<string, string> = {
  chainladder: "Development pattern extrapolation",
  bf: "Credibility-weighted estimate",
  capecod: "Premium-based expected losses",
};

export function MethodNode({ id, data, selected }: NodeProps<MethodNodeType>) {
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);

  const setMethod = (type: MethodType) => {
    updateNodeData(id, { methodType: type });
  };

  return (
    <>
    <Card
      className={`w-64 shadow-xl transition-all duration-200  bg-linear-to-b from-amber-50 to-white dark:from-neutral-800 border dark:to-neutral-800/90 ${
        selected ? "dark:border-amber-200 border-amber-500" : "border-slate-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-sky-400 border-2 border-white shadow"
      />

      {data.methodType === "none" ? (
        <>
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 rounded-full bg-amber-400" />
              <span className="h-6 inline-flex items-center text-xs font-semibold uppercase tracking-widest">
                IBNR Method
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground pl-3.5 mt-0.5">
              Select a reserving method
            </p>
          </CardHeader>

          <Separator className="mb-3" />

          <CardContent className="px-3 pb-4 space-y-1.5">
            {(["chainladder", "bf", "capecod"] as MethodType[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-amber-200 bg-white hover:bg-amber-50 hover:border-amber-400 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="text-xs font-semibold text-amber-900 group-hover:text-amber-700">
                  {METHOD_LABELS[m]}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {METHOD_DESCRIPTIONS[m]}
                </div>
              </button>
            ))}
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 rounded-full bg-amber-400" />
                <Badge
                  variant="secondary"
                  className="text-[10px] h-6 uppercase tracking-wider bg-amber-100 text-amber-800 border-amber-200"
                >
                  {METHOD_LABELS[data.methodType]}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:bg-transparent dark:hover:bg-transparent dark:hover:text-amber-500 hover:text-amber-700"
                onClick={() => setMethod("none")}
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground pl-3.5 mt-0.5">
              {METHOD_DESCRIPTIONS[data.methodType]}
            </p>
          </CardHeader>

          <Separator />

          <CardContent className="px-4 py-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
                  Projected IBNR
                </div>
                <div className="text-2xl font-mono font-semibold text-amber-900 dark:text-amber-100 tracking-tight">
                  ${data.results?.totalIbnr?.toLocaleString() ?? "0.00"}
                </div>
              </div>
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900">
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-sky-400 border-2 border-white shadow"
      />
    </Card>

    <span className="text-xs text-muted-foreground dark:text-muted-foreground/50">{`#${id}`}</span>
    </>
  );
}
