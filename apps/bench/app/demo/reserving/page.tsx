'use client'

import { useState, useTransition } from 'react';
import { calculateReservesAction, ResponseType } from './actions';
import { Triangle } from '@/lib/types';
import { Input } from '@ui/input';
import { Button } from '@ui/button';

// Initial 3x3 Triangle (Rows: Accident Years, Cols: Dev Periods)
const INITIAL_TRIANGLE: Triangle = [
  [100, 150, 160], // AY 1
  [110, 155, null], // AY 2 (Not fully developed)
  [120, null, null] // AY 3 (Newest)
];

export default function TriangleEditor() {
  const [triangle, setTriangle] = useState<Triangle>(INITIAL_TRIANGLE);
  const [results, setResults] = useState<ResponseType | null>(null);
  const [isPending, startTransition] = useTransition();

  // 1. Handle Cell Edits (Local State - Instant)
  const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
    const newVal = value === '' ? null : Number(value);
    
    const newTriangle = [...triangle];
    newTriangle[rowIdx] = [...newTriangle[rowIdx]]; // Copy row
    newTriangle[rowIdx][colIdx] = newVal;
    
    setTriangle(newTriangle);
  };

  // 2. Trigger Calculation (Server Action)
  const handleCalculate = () => {
    startTransition(async () => {
      // We pass the javascript object directly!
      // Next.js handles the serialization for us.
      const newResults = await calculateReservesAction(results || { ibnr: 0, ldfs: [] }, triangle);
      setResults(newResults);
    });
  };

  return (
    <div className="p-8">
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT: The Input Triangle */}
        <div>
          <h2 className="text-xl font-bold mb-4">Paid Claims Triangle</h2>
          <div className="rounded p-4  overflow-auto">
            <table className="w-full">
              <tbody>
                {triangle.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={`${r}-${c}`} className="p-1">
                        <Input
                          type="number"
                          value={cell ?? ''}
                          onChange={(e) => handleCellChange(r, c, e.target.value)}
                          className="w-24 p-2 border text-right rounded font-mono"
                          // Disable bottom-right "future" cells if needed
                          disabled={c > (row.length - 1 - r) + 10} // simplistic logic
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Button
            onClick={handleCalculate}
            disabled={isPending}
          >
            {isPending ? 'Running Chainladder...' : 'Calculate Reserves'}
          </Button>
        </div>

        {/* RIGHT: The Results */}
        <div className="border rounded p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          
          {results?.error && (
            <div className="text-destructive mb-4">{results.error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-500">Calculated IBNR</label>
              <div className="text-3xl font-mono text-accent">
                {results?.ibnr 
                  ? `$${results.ibnr.toLocaleString()}` 
                  : '---'}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500">Selected LDFs</label>
              <div className="flex gap-2 mt-1">
                {results?.ldfs.map((ldf, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                    {ldf.toFixed(3)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}