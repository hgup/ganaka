import { create } from "zustand";

export type DatasetMeta = {
  name: string;
  id: string;
  original_filename: string;
  row_count: number;
  table_type: string;
};

export interface UIState {
  leftSidebar: {
    tab: "Nodes" | "Data";
    data: {
      datasets: DatasetMeta[];
      uploading: boolean;
    };
    nodes: {
      scope: number[];
    };
  };
  activeMethodPane: "chain-ladder" | "bf" | "cape-cod";
  exportFormat: "XLSX" | "CSV" | "PDF";
  setMethodPane: (pane: UIState["activeMethodPane"]) => void;
  setExportFormat: (format: UIState["exportFormat"]) => void;
  setDatasets: (data: DatasetMeta[]) => void;
  setLeftTab: (tab: UIState["leftSidebar"]["tab"]) => void;
  fetchDatasets: (project_id: string) => void;
  setUploadingDataset: (state: boolean) => void;
  initialize: (project_id: string)  => void;
  // Undo redo with zundo
  changed: boolean,
  setChanged: (b: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  initialize: (project_id) =>{
    get().fetchDatasets(project_id)
  } ,
  changed: false,
  setChanged: (b) => set({changed: b}),
  leftSidebar: {
    tab: "Nodes" as const,
    nodes: {
      scope: [],
    },
    data: {
      datasets: [],
      uploading: false,
    },
  },
  activeMethodPane: "chain-ladder",
  exportFormat: "XLSX",
  setMethodPane: (pane) => set({ activeMethodPane: pane }),
  setExportFormat: (format) => set({ exportFormat: format }),
  fetchDatasets: (project_id) => {
    fetch(`/projects/${project_id}/data`)
      .then((res) => res.json())
      .then((d) => get().setDatasets(d));
  },
  setUploadingDataset: (d) =>
    set((s) => ({
      leftSidebar: {
        ...s.leftSidebar,
        data: { ...s.leftSidebar.data, uploading: d },
      },
    })),
  setDatasets: (data) =>
    set((s) => ({
      leftSidebar: {
        ...s.leftSidebar,
        data: {
          ...s.leftSidebar.data,
          datasets: data,
        },
      },
    })),
  setLeftTab: (tab) =>
    set((s) => ({
      leftSidebar: { ...s.leftSidebar, tab },
    })),

}));
