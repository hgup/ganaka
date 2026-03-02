// src/components/canvas/Nodes/MethodNode.tsx
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { MethodNodeData, MethodType, useCanvasStore } from '@/store/useCanvasStore';

export type MethodNodeType = Node<MethodNodeData, 'methodNode'>;

export function MethodNode({ id, data, selected }: NodeProps<MethodNodeType>) {
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);

  const setMethod = (type: MethodType) => {
    updateNodeData(id, { methodType: type });
  };

  return (
    <div className={`min-w-60 rounded-lg border bg-[#1a1a1a] p-1 text-white shadow-2xl transition-all ${
      selected ? 'border-blue-500' : 'border-slate-700'
    }`}>
      {/* Input Port (Data flows IN) */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />

      {/* NODE CONTENT */}
      <div className="p-3">
        {data.methodType === 'none' ? (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Select Method</span>
            <div className="grid grid-cols-1 gap-1">
              {['chainladder', 'bf', 'capecod'].map((m) => (
                <button 
                  key={m}
                  onClick={() => setMethod(m as MethodType)}
                  className="text-left px-2 py-1.5 text-xs rounded hover:bg-slate-800 border border-transparent hover:border-slate-600 capitalize"
                >
                  {m === 'chainladder' ? 'Chain Ladder' : m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase">
                {data.methodType === 'chainladder' ? 'Chain Ladder' : data.methodType.toUpperCase()}
              </span>
              <button onClick={() => setMethod('none')} className="text-[10px] text-slate-500 hover:text-white">Change</button>
            </div>
            
            <div className="text-xl font-mono text-slate-100">
              ${data.results?.totalIbnr?.toLocaleString() || '0.00'}
              <span className="text-[10px] block text-slate-500 font-sans">Projected IBNR</span>
            </div>
          </div>
        )}
      </div>

      {/* Output Port (Results flow OUT) */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  );
}