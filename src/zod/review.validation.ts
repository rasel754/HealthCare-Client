import { z } from "zod";

export const createReviewZodSchema = z.object({
    appointmentId: z.string().min(1, "Appointment ID is required"),
    rating: z.coerce.number().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
    comment: z.string().min(2, "Comment is required"),
});

export const updateReviewZodSchema = z.object({
    rating: z.coerce.number().min(1).max(5).optional(),
    comment: z.string().optional(),
});

export type ICreateReviewPayload = z.infer<typeof createReviewZodSchema>;
export type IUpdateReviewPayload = z.infer<typeof updateReviewZodSchema>;
