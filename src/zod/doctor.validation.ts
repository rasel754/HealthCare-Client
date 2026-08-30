import { z } from "zod";
import { Gender } from "../types/auth.type";

export const createDoctorZodSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    doctor: z.object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email address"),
        contactNumber: z.string().min(6, "Contact number is required"),
        address: z.string().optional(),
        registrationNumber: z.string().min(1, "Registration number is required"),
        experience: z.coerce.number().optional(),
        gender: z.nativeEnum(Gender),
        appointmentFee: z.coerce.number().min(0, "Appointment fee is required"),
        qualification: z.string().min(1, "Qualification is required"),
        currentWorkingPlace: z.string().min(1, "Working place is required"),
        designation: z.string().min(1, "Designation is required"),
    }),
    specialties: z.array(z.string()).min(1, "At least one specialty must be selected"),
});

export const updateDoctorZodSchema = z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string().optional(),
    experience: z.coerce.number().optional(),
    gender: z.nativeEnum(Gender).optional(),
    appointmentFee: z.coerce.number().optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string().optional(),
    specialties: z.array(z.string()).optional(),
});

export type ICreateDoctorPayload = z.infer<typeof createDoctorZodSchema>;
export type IUpdateDoctorPayload = z.infer<typeof updateDoctorZodSchema>;
