import { z } from "zod";

export const loginZodSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
});

export const registerZodSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    contactNumber: z.string().min(6, "Contact number is required"),
    address: z.string().optional(),
});

export const verifyEmailZodSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(4, "OTP must be at least 4 digits"),
});

export const forgetPasswordZodSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const resetPasswordZodSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(4, "OTP is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const changePasswordZodSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IRegisterPayload = z.infer<typeof registerZodSchema>;
export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;
export type IForgetPasswordPayload = z.infer<typeof forgetPasswordZodSchema>;
export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;
export type IChangePasswordPayload = z.infer<typeof changePasswordZodSchema>;