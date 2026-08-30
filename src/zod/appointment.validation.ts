import { z } from "zod";
import { AppointmentStatus } from "../types/auth.type";

export const bookAppointmentZodSchema = z.object({
    doctorId: z.string().min(1, "Doctor ID is required"),
    scheduleId: z.string().min(1, "Schedule slot is required"),
});

export const changeAppointmentStatusZodSchema = z.object({
    status: z.nativeEnum(AppointmentStatus),
});

export type IBookAppointmentPayload = z.infer<typeof bookAppointmentZodSchema>;
export type IChangeAppointmentStatusPayload = z.infer<typeof changeAppointmentStatusZodSchema>;
