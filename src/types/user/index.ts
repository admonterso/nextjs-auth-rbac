import { z } from "zod";
import { Role, RoleSchema } from "../role";
import { CustomDocumentReference } from "../firestore";

export type User = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  fullName: z.string({
    required_error: "Full name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  phoneNumber: z.string().min(9, {
    message: "Phone number must be at least 9 characters",
  }),
  payments: CustomDocumentReference.array(),
  family: CustomDocumentReference,
});
export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export const RegisterUserSchema = z.object({
  fullName: z.string({
    required_error: "Full name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
    })
    .min(9, {
      message: "Phone number must be at least 9 characters",
    }),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

export const AuthUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});
