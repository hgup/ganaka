"use server";

import { multiplyTestsMultiplyPost } from "@api/calculation/calculation";
import { CalculationResponse } from "@api/schemas/calculationResponse.zod";
import { MultiplyTestsMultiplyPostBody } from "@api/schemas/multiplyTestsMultiplyPostBody.zod";

export async function processDataAction(
  prevState: CalculationResponse,
  formData: FormData,
) {
  //  Step 1
  const validation = MultiplyTestsMultiplyPostBody.loose().safeParse(
    Object.fromEntries(formData),
  );
  if (!validation.success) {
    return {
      ...prevState,
      success: false,
      message: "Validation Failed",
    };
  }
  try {
    const { data, status } = await multiplyTestsMultiplyPost(validation.data);
    switch (status) {
      case 200:
        return data;
      case 422:
        return { ...prevState, success: false}
    }
  } catch {
    return { ...prevState, success: false, message: "Internal Server Error" };
  }
}
