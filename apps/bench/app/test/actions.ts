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

// import { CalculationState } from "@type/api";

// const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

// export async function processDataAction(
//   prevState: CalculationState,
//   formData: FormData,
// ): Promise<CalculationState> {
//   const inputValue = parseFloat(formData.get("inputValue") as string);
//   const modifier = parseFloat(formData.get("modifier") as string);

//   if (isNaN(inputValue) || isNaN(modifier)) {
//     return {
//       ...prevState,
//       error: "Invalid input numbers",
//       message: "Validation Failed",
//     };
//   }

//   try {
//     const response = await fetch(`${FASTAPI_URL}/tests/multiply`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // Add auth here just in case
//       },
//       body: JSON.stringify({
//         input_value: inputValue,
//         modifier: modifier,
//       }),
//     });

//     const data = await response.json();

//     if (!data.success) {
//       return {
//         result: null,
//         error: data.message,
//         message: "Error from Backend",
//       };
//     }

//     return {
//       result: data.result,
//       error: null,
//       message: data.message,
//     };
//   } catch (err) {
//     return {
//       result: null,
//       error: `Failed to process data`,
//       message: "Internal Server Error",
//     };
//   }
// }
