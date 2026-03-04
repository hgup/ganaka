"use client";
import Controls from "./Controls";
import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  type FitViewOptions,
  type DefaultEdgeOptions,
  NodeMouseHandler,
  Background,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { useTheme } from "next-themes";

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

// Import our Zustand store
import { useCanvasStore } from "@/store/useCanvasStore";
import { TriangleNode, TriangleNodeType } from "./Nodes/TriangleNode";
import { MethodNode, MethodNodeType } from "./Nodes/MethodNode";
import { CanvasContextMenu } from "./ContextMenu";
import { useUIStore } from "@/store/useUIStore";

// TODO: We will build these in the next step and import them properly!
// import { TriangleNode } from './Nodes/TriangleNode';
// import { ChainLadderNode } from './Nodes/ChainLadderNode';

const nodeTypes = {
  // Temporary placeholders so the canvas doesn't crash before we build the real ones
  triangleNode: TriangleNode,
  methodNode: MethodNode,
};

function Flow() {
  const { resolvedTheme } = useTheme();
  const { screenToFlowPosition } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    selectedNodeId,
    pendingNodeType,
    addNodeAtPosition,
  } = useCanvasStore();

  // const setChanged = useUIStore((s) => s.setChanged);
  // const unsubscribe = useCanvasStore.subscribe((s, p) => {
  //   if (s.nodes !== p.nodes) setChanged(true);
  //   if (s.edges !== p.edges) setChanged(true);
  // });

  // useEffect(() => {
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [unsubscribe]);

  const onPaneClick = useCallback(
    (e: React.MouseEvent) => {
      if (pendingNodeType) {
        // if holding a tool
        const position = screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        });

        // Drop node there
        addNodeAtPosition(pendingNodeType, position);
      } else {
        // Normal behavior
        selectNode(null);
      }
    },
    [pendingNodeType, screenToFlowPosition, addNodeAtPosition, selectNode],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode],
  );
  const onPaneContextMenu = useCallback(() => {
    selectNode(null);
    if (selectedNodeId)
      onNodesChange([
        {
          id: selectedNodeId,
          type: "select",
          selected: false,
        },
      ]);
  }, [selectedNodeId, onNodesChange, selectNode]);

  const onNodeContextMenu: NodeMouseHandler = useCallback(
    (event: React.MouseEvent, node) => {
      if (selectedNodeId)
        onNodesChange([
          {
            id: selectedNodeId,
            type: "select",
            selected: false,
          },
        ]);
      selectNode(node.id);
      onNodesChange([
        {
          id: node.id,
          type: "select",
          selected: true,
        },
      ]);
    },
    [selectNode, onNodesChange, selectedNodeId],
  );

  return (
    <main className="flex-1 relative overflow-scroll">
      <CanvasContextMenu>
        <ReactFlow
          className="h-full w-full"
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onPaneContextMenu={onPaneContextMenu}
          onNodeContextMenu={onNodeContextMenu}
          onConnect={onConnect}
          proOptions={{ hideAttribution: true }}
          colorMode={resolvedTheme as "light" | "dark" | "system"}
          fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          // fitView // autozoom to fit nodes
        >
          <MiniMap />
          <Background variant={BackgroundVariant.Cross} gap={24} size={2} />
          <Controls />
        </ReactFlow>
      </CanvasContextMenu>
    </main>
  );
}

export default function Canvas() {
  return (
      <Flow />
  );
}
