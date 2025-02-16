// utils/validation.ts
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

// Login Schema
export const loginSchema = z.object({
  password: z.string().min(4, "PIN must be at least 4 characters"),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

// OTP Schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

// Formik Validation Schemas
export const loginValidationSchema = toFormikValidationSchema(loginSchema);
export const forgotPasswordValidationSchema =
  toFormikValidationSchema(forgotPasswordSchema);
export const otpValidationSchema = toFormikValidationSchema(otpSchema);
