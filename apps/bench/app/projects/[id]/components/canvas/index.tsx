"use client";
import Controls from "./Controls";
import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  NodeMouseHandler,
  Background,
  BackgroundVariant,
  MiniMap,
} from "@xyflow/react";
import { useTheme } from "next-themes";

const initialNodes: Node[] = [
  { id: "1", data: { label: "Data" }, position: { x: 5, y: 5 } },
  {
    id: "2",
    data: { label: "Bornhuetter-Ferguson" },
    position: { x: 5, y: 100 },
  },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};

// Import our Zustand store
import { useCanvasStore } from "@/store/useCanvasStore";

// TODO: We will build these in the next step and import them properly!
// import { TriangleNode } from './Nodes/TriangleNode';
// import { ChainLadderNode } from './Nodes/ChainLadderNode';

const nodeTypes = {
  // Temporary placeholders so the canvas doesn't crash before we build the real ones
  triangleNode: () => (
    <div className="px-4 py-2 bg-slate-800 text-white rounded border border-teal-500 shadow-lg">
      [Data] Auto BI Triangle
    </div>
  ),
  chainLadderNode: () => (
    <div className="px-4 py-2 bg-slate-800 text-white rounded border border-slate-600 shadow-lg">
      [Method] Chain Ladder
    </div>
  ),
};

export default function Canvas() {
  const { resolvedTheme } = useTheme();
  const [activeTool, setActiveTool] = useState("select");
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, selectNode } =
    useCanvasStore();

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  return (
    <main className="flex-1 relative overflow-hidden">
      <div 
      className="h-full w-full"
      // style={{ width: "100vw", height: "100vh" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          proOptions={{ hideAttribution: true }}
          colorMode={resolvedTheme as "light" | "dark" | "system"}
          fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView // autozoom to fit nodes
        >
          <MiniMap />
          <Background
            variant={BackgroundVariant.Cross}
            gap={24}
            size={2}
          />
          <Controls activeTool={activeTool} onToolChange={setActiveTool} />
        </ReactFlow>
      </div>
    </main>
  );
}
