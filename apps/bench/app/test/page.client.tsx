'use client'

import { useActionState } from "react"
import { processDataAction } from "./actions"
import { CalculationState } from "@type/api"


const initialState: CalculationState = {
    result: null,
    error: null,
    message: "",
}


export default function CalculationClient() {
  const [state, formAction, isPending] = useActionState(processDataAction, initialState);

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">FastAPI Integration</h1>
      
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium">Input Value</label>
          <input 
            name="inputValue" 
            type="number" 
            step="0.01"
            className="border p-2 rounded w-full text-black" 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Modifier</label>
          <input 
            name="modifier" 
            type="number" 
            step="0.01"
            className="border p-2 rounded w-full text-black" 
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isPending ? 'Processing...' : 'Calculate'}
        </button>
      </form>

      {/* State Feedback Section */}
      <div className="mt-6 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold text-gray-700">Server Response:</h3>
        
        {state.error && (
          <div className="text-red-600 mt-2">
            ❌ {state.error}
          </div>
        )}

        {state.result !== null && (
          <div className="text-green-600 mt-2">
            ✅ Result: {state.result}
            <p className="text-xs text-gray-500">{state.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}