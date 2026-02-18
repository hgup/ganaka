"use server";

import { CalculationState } from "@type/api";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function processDataAction(
  prevState: CalculationState,
  formData: FormData,
): Promise<CalculationState> {
  const inputValue = parseFloat(formData.get("inputValue") as string);
  const modifier = parseFloat(formData.get("modifier") as string);

  if (isNaN(inputValue) || isNaN(modifier)) {
    return {
      ...prevState,
      error: "Invalid input numbers",
      message: "Validation Failed",
    };
  }

  try {
    const response = await fetch(`${FASTAPI_URL}/tests/multiply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add auth here just in case
      },
      body: JSON.stringify({
        input_value: inputValue,
        modifier: modifier,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        result: null,
        error: data.message,
        message: "Error from Backend",
      };
    }

    return {
      result: data.result,
      error: null,
      message: data.message,
    };
  } catch (err) {
    return {
      result: null,
      error: `Failed to process data`,
      message: "Internal Server Error",
    };
  }
}
