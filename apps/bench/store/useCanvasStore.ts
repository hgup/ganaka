import { create } from "zustand";
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  OnEdgesDelete,
} from "@xyflow/react";
import { useUIStore } from "./useUIStore";
import { toast } from "sonner";
import { calculateMethodAction } from "./actions";

type NodeTypes = "methodNode" | "triangleNode";

// "Uploaded CSV"
export type TriangleNodeData = Record<string, unknown> & {
  fileName: string;
  isUploaded: boolean;
  dataId: string | null;
  availableMeasures: string[];
  selectedMeasure: string;

  metadata?: {
    originRange: [number, number]; // e.g., [1969, 2024]
    devRange: [number, number]; // e.g., [12, 120]
    rowCount: number;
    valuationDate?: string; // The "As Of" date of the data
    isCumulative: boolean; // Crucial for chainladder-python logic
  };

  // --- UI & State Management ---
  isProcessing: boolean; // Loading state for the node
  lastValidated: string; // Timestamp
  errorMessage?: string; // Display errors (e.g., "Duplicate years found")
};
export type MethodType = "none" | "chainladder" | "bf" | "capecod";

// Generic "Method Node"
export type MethodNodeData = Record<string, unknown> & {
  methodType: MethodType;
  // Parameters for specific methods
  config: {
    averageMethod?: "volume" | "simple" | "regression"; // cl.Development params
    nPeriods?: number | "all";
    lrt?: number; // for BF
  };
  results?: {
    totalIbnr: number;
  };
};

export type TriangleNodeType = Node<TriangleNodeData, "triangleNode">;
export type MethodNodeType = Node<MethodNodeData, "methodNode">;

// Combine them into a custom Node type for strict typing
export type CanvasNode = TriangleNodeType | MethodNodeType;
interface CanvasState {
  // Core Canvas State
  nodes: CanvasNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  pendingNodeType: NodeTypes | null;

  // Canvas Actions (React Flow Requirements)
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onEdgeDelete: OnEdgesDelete;
  onConnect: (connection: Connection) => void;

  // Business Logic Actions
  addNode: (node: CanvasNode) => void;
  removeNode: (id: string | null) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: <T = TriangleNodeData | MethodNodeData>(
    id: string,
    dataUpdate: Partial<T>,
  ) => void;

  // Actions
  setPendingNode: (type: NodeTypes | null) => void;
  addNodeAtPosition: (
    type: NodeTypes,
    position: { x: number; y: number },
  ) => void;
  getNode: (id: string) => CanvasNode | null;
  clear: () => void;
  init: (project_id: string) => void;
  runMethodNode: (methodNodeId: string, projectId: string) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  init: (project_id) => {
    fetch(`/projects/${project_id}/data/canvas`)
      .then((res) => res.json())
      .then((d) => {
        if (!d.error) {
          const updates = JSON.parse(d);
          set({ ...updates });
        }
      });
  },
  clear: () => {
    set({ nodes: [], edges: [] });
  },
  nodes: [],
  edges: [],
  selectedNodeId: null,
  pendingNodeType: null,
  setPendingNode: (type) => {
    set({ pendingNodeType: type });
  },

  addNodeAtPosition: (type, position) => {
    const id = `${type}-${crypto.randomUUID()}`;
    const newNode: CanvasNode =
      type === "triangleNode"
        ? {
            id,
            type,
            position,
            data: {
              fileName: "Please select Data",
              isUploaded: false,
              dataId: null,
              availableMeasures: [],
              selectedMeasure: '',
              isProcessing: false,
              lastValidated: "",
            },
          }
        : {
            id,
            type,
            position,
            data: {
              methodType: "none",
              config: {},
            },
          };

    get().addNode(newNode);
    set({
      selectedNodeId: id,
      pendingNodeType: null,
    });

    useUIStore.getState().setChanged(true);
  },

  getNode: (id) => get().nodes.find((n) => n.id === id) ?? null,

  // --- REACT FLOW MECHANICS ---
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as CanvasNode[] });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onEdgeDelete: () => {
    useUIStore.getState().setChanged(true);
  },
  onConnect: (connection) => {
    // Only allow connection if we don't already have one (keep MVP simple)
    set({ edges: addEdge(connection, get().edges) });
    useUIStore.getState().setChanged(true);
  },

  // --- YOUR APP LOGIC ---
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  removeNode: (id) => {
    set({ nodes: [...get().nodes.filter((n) => n.id !== id)] });
    useUIStore.getState().setChanged(true);
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  // This is the magic function the Right Sidebar uses to tweak parameters!
  updateNodeData: (id, dataUpdate) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          if (node.type === "methodNode") {
            return {
              ...node,
              data: { ...node.data, ...(dataUpdate as MethodNodeData) },
            };
          } else if (node.type === "triangleNode")
            return {
              ...node,
              data: { ...node.data, ...(dataUpdate as TriangleNodeData) },
            };
        }
        return node;
      }),
    });
    useUIStore.getState().setChanged(true);
  },

  runMethodNode: async (methodNodeId: string, projectId: string) => {
    const { nodes, edges, updateNodeData } = get();

    // 1. Find the target Method Node
    const methodNode = get().getNode(methodNodeId);
    if (!methodNode || methodNode.type !== "methodNode") return;

    // 2. Find the edge feeding INTO this method node
    const incomingEdge = edges.find((e) => e.target === methodNodeId);
    if (!incomingEdge) {
      toast.error(
        "Please connect a Triangle Data node to this Method node first.",
      );
      return;
    }

    // 3. Find the Source Data Node (i.e. source of the edge)
    const sourceNode = nodes.find((n) => n.id === incomingEdge.source);

    if (!sourceNode || sourceNode.type !== "triangleNode") {
      toast.error("The node connected is not a triangle node :(");
      return;
    }
    const sourceTableId = sourceNode.data.dataId;

    if (sourceTableId === null) {
      toast.error(
        "The connected Data node doesn't have an uploaded table yet.",
      );
      return;
    }

    // 4. Set node to a loading state (optional but good UX)
    updateNodeData(methodNodeId, { isCalculating: true });

    // 5. Call the FastAPI engine
    try {
      const response = await calculateMethodAction({
        projectId,
        config: methodNode.data.config,
        sourceTableId: sourceNode.data.dataId ?? "",
        methodType: methodNode.data.methodType,
        columnName: sourceNode.data.selectedMeasure,
      });

      // 4. Handle the Return in the Store
      if (response.success) {
        updateNodeData(methodNodeId, {
          results: {
            totalIbnr: response.results.total_ibnr,
          },
          isCalculating: false,
        });
        useUIStore.getState().setChanged(true);
        toast.success("Calculation complete!");
      } else {
        updateNodeData(methodNodeId, { isCalculating: false });
        toast.error(response.error || "An error occurred");
      }
    } catch {}
  },
}));
