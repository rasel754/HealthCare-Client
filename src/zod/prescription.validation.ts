import { z } from "zod";

export const createPrescriptionZodSchema = z.object({
    appointmentId: z.string().min(1, "Appointment ID is required"),
    instructions: z.string().min(2, "Instructions are required"),
    followUpDate: z.string().optional(),
});

export const updatePrescriptionZodSchema = z.object({
    instructions: z.string().optional(),
    followUpDate: z.string().optional(),
});

export type ICreatePrescriptionPayload = z.infer<typeof createPrescriptionZodSchema>;
export type IUpdatePrescriptionPayload = z.infer<typeof updatePrescriptionZodSchema>;
