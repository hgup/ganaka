"use server";

import { calculateReservingCalculateReservesPost } from "@api/reserving/reserving";
import { CalculateReservingCalculateReservesPostBody } from "@api/schemas/calculateReservingCalculateReservesPostBody.zod";
import { ReservingResponse } from "@api/schemas/reservingResponse.zod";
import { Triangle } from "@lib/types";

export type ResponseType = ReservingResponse & { success?: boolean, error?: string }

export async function calculateReservesAction(
  prevState: ReservingResponse,
  triangleData: Triangle,
): Promise<ResponseType> {
  const validation =
    CalculateReservingCalculateReservesPostBody.loose().safeParse({
      triangle: triangleData,
    });

  if (!validation.success) {
    return {
      ...prevState,
      error: "Invalid input data. Please check the triangle values.",
    };
  }
  try {
    const { data, status } = await calculateReservingCalculateReservesPost(
      validation.data,
    );
    switch (status) {
      case 200:
        return data;
      case 422:
        return {
          ...prevState,
          success: false,
        error: "Error while calculating.",
        };
    }
  } catch {
    return {
      ...prevState,
      success: false,
    };
  }
}
