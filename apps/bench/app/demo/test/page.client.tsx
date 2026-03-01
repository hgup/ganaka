"use client";

import { useActionState } from "react";
import { processDataAction } from "./actions";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { CalculationResponse } from "@api/schemas/calculationResponse.zod";

const initialState: CalculationResponse = { success: false, message: '', result: 0 }

/**
 * Orval compatable implementation
 */
export default function CalculationClient() {
  // Step 1
  const [state, formAction, isPending] = useActionState(processDataAction, initialState);
  return (
    <form action={formAction}>
      <Input
        name="input_value"
        type="number"
        step="0.01"
        required
        placeholder="Input Value"
      />
      <Input
        name="modifier"
        type="number"
        step="0.01"
        required
        placeholder="Modifier"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Processing..." : "Calculate"}
      </Button>
      {state.success && <p>Result: {state.result}</p>}
      {state.message && !state.success && <p className="text-red-500">{state.message}</p>}
    </form>
  );
}
