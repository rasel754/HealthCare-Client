import { z } from "zod";

export const createSpecialtyZodSchema = z.object({
    title: z.string().min(1, "Specialty title is required"),
    description: z.string().optional(),
});

export type ICreateSpecialtyPayload = z.infer<typeof createSpecialtyZodSchema>;
