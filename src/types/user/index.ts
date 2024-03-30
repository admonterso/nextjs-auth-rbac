import { z } from "zod";
import { Role, RoleSchema } from "../role";

// extract the inferred type
export type User = z.infer<typeof RegisterUserSchema>;

export const RegisterUserSchema = z.object({
  fullName: z.string(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .optional(),
  role: RoleSchema,
});
