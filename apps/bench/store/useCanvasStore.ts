import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  Connection, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  NodeChange, 
  EdgeChange 
} from '@xyflow/react';

// "Uploaded CSV"
export type TriangleNodeData = Record<string, unknown> & {
  fileName: string;
  isUploaded: boolean;
  metadata?: {
    originYears: number;
    devPeriods: number;
    totalLoss: number;
  };
}

// "Chain Ladder Node"
export type ChainLadderNodeData = Record<string, unknown> & {
  averageMethod: 'volume' | 'simple' | 'regression'; // cl.Development params
  nPeriods: number | 'all';
  results?: {
    totalIbnr: number;
    projectedUltimate: number;
  };
}

// Combine them into a custom Node type for strict typing
export type CanvasNode = Node<TriangleNodeData | ChainLadderNodeData>;


interface CanvasState {
  // Core Canvas State
  nodes: CanvasNode[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Canvas Actions (React Flow Requirements)
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Business Logic Actions
  addNode: (node: CanvasNode) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, dataUpdate: Partial<TriangleNodeData | ChainLadderNodeData>) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  // --- REACT FLOW MECHANICS ---
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as CanvasNode[] });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    // Only allow connection if we don't already have one (keep MVP simple)
    set({ edges: addEdge(connection, get().edges) });
  },

  // --- YOUR APP LOGIC ---
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },
  
  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  // This is the magic function the Right Sidebar uses to tweak parameters!
  updateNodeData: (id, dataUpdate) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          // Merge the existing data with the new tweaks (e.g., changing 'volume' to 'simple')
          return {
            ...node,
            data: { ...node.data, ...dataUpdate },
          };
        }
        return node;
      }),
    });
  },
}));