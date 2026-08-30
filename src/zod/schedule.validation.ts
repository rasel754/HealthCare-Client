import { z } from "zod";

export const createScheduleZodSchema = z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    startTime: z.string().min(1, "Start time is required (HH:mm)"),
    endTime: z.string().min(1, "End time is required (HH:mm)"),
});

export const assignDoctorScheduleZodSchema = z.object({
    scheduleIds: z.array(z.string()).min(1, "Select at least one schedule slot"),
});

export const updateDoctorScheduleZodSchema = z.object({
    scheduleIds: z.array(
        z.object({
            id: z.string(),
            shouldDelete: z.boolean(),
        })
    ),
});

export type ICreateSchedulePayload = z.infer<typeof createScheduleZodSchema>;
export type IAssignDoctorSchedulePayload = z.infer<typeof assignDoctorScheduleZodSchema>;
export type IUpdateDoctorSchedulePayload = z.infer<typeof updateDoctorScheduleZodSchema>;
