"use server";

import { getDoctorsService } from "@/src/services/doctor.services";

export const getDoctores = async () => {
  try {
    return await getDoctorsService({ limit: 20 });
  } catch (error) {
    console.error("Error prefetching doctors:", error);
    return { success: false, data: [] };
  }
};
